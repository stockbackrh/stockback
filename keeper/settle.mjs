// Stockback settlement keeper. Takes accepted claims, buys the brand's tokenized share on Robinhood Chain
// with ETH from the treasury (ETH -> USDG -> stock via Uniswap v3 SwapRouter02) and delivers it straight to the claimant.
// Usage: node keeper/settle.mjs [--loop] [--dry]      env: TREASURY_PK, SUPABASE_URL, SUPABASE_ANON_KEY, STOCKBACK_API_SECRET, RPC_URL
import { ethers } from 'ethers';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { SB } = require('../shelf.js');
const env = process.env, DRY = process.argv.includes('--dry'), LOOP = process.argv.includes('--loop');
const RPC = env.RPC_URL || 'https://rpc.mainnet.chain.robinhood.com';
const WETH = '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73', USDG = '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168';
const FACTORY = '0x1f7d7550B1b028f7571E69A784071F0205FD2EfA', ROUTER = '0xcaf681a66d020601342297493863e78c959e5cb2', QUOTER = '0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7';
const MAX_ETH_PER_CLAIM = Number(env.MAX_ETH_PER_CLAIM || '0.02'), SLIPPAGE = 0.02;
const fr = new ethers.FetchRequest(RPC); fr.setHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0 Safari/537.36'); fr.setHeader('Origin', 'https://robinhood.com');
const provider = new ethers.JsonRpcProvider(fr, 4663, { staticNetwork: true });
const wallet = env.TREASURY_PK ? new ethers.Wallet(env.TREASURY_PK, provider) : null;
const factory = new ethers.Contract(FACTORY, ['function getPool(address,address,uint24) view returns(address)'], provider);
const quoter = new ethers.Contract(QUOTER, ['function quoteExactInput(bytes path, uint256 amountIn) returns (uint256 amountOut, uint160[] sqrtPriceX96AfterList, uint32[] initializedTicksCrossedList, uint256 gasEstimate)'], provider);
const router = new ethers.Contract(ROUTER, ['function exactInput((bytes path,address recipient,uint256 amountIn,uint256 amountOutMinimum)) payable returns (uint256 amountOut)'], wallet || provider);
const erc20 = a => new ethers.Contract(a, ['function balanceOf(address) view returns(uint256)', 'function decimals() view returns(uint8)'], provider);
const feeCache = {};
async function bestFee(token) {
  if (feeCache[token]) return feeCache[token];
  let best = null;
  for (const fee of [100, 500, 3000, 10000]) {
    const pool = await factory.getPool(token, USDG, fee); if (pool === ethers.ZeroAddress) continue;
    const bal = await erc20(USDG).balanceOf(pool);
    if (!best || bal > best.bal) best = { fee, bal, pool };
  }
  if (!best || best.bal < 1000n * 10n ** 6n) throw new Error('no usable USDG pool for ' + token);
  return (feeCache[token] = best.fee);
}
const path = (fee2, token) => ethers.solidityPacked(['address', 'uint24', 'address', 'uint24', 'address'], [WETH, 100, USDG, fee2, token]);
async function supa(p, opts = {}) {
  const r = await fetch(env.SUPABASE_URL + p, { ...opts, headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const t = await r.text(); if (!r.ok) throw new Error(t); return t ? JSON.parse(t) : null;
}
const mark = (id, status, tx, amount, reason) => supa('/rest/v1/rpc/stockback_settle_claim', { method: 'POST', body: JSON.stringify({ p_secret: env.STOCKBACK_API_SECRET, p_id: id, p_status: status, p_tx: tx, p_amount: amount, p_reason: reason }) });
async function settle(c) {
  const token = c.token_address || SB.address(c.ticker); if (!token) return mark(c.id, 'queued', null, null, 'no token address for ' + c.ticker);
  const fee2 = await bestFee(token);
  // price ETH in USDG through the same router path, then size the ETH so its USDG value equals the reward
  const probe = ethers.parseEther('0.001');
  const q0 = await quoter.quoteExactInput.staticCall(ethers.solidityPacked(['address', 'uint24', 'address'], [WETH, 100, USDG]), probe);
  const ethUsd = Number(ethers.formatUnits(q0[0], 6)) / 0.001;
  const amountIn = ethers.parseEther((Number(c.reward_usd) / ethUsd * 1.005).toFixed(18));
  if (Number(ethers.formatEther(amountIn)) > MAX_ETH_PER_CLAIM) return mark(c.id, 'queued', null, null, 'reward above per-claim ETH cap');
  const q = await quoter.quoteExactInput.staticCall(path(fee2, token), amountIn);
  const dec = await erc20(token).decimals();
  const minOut = q[0] - q[0] * BigInt(Math.round(SLIPPAGE * 1000)) / 1000n;
  console.log(`  ${c.ticker} reward $${c.reward_usd} -> ${ethers.formatEther(amountIn)} ETH @ $${ethUsd.toFixed(0)} -> ~${ethers.formatUnits(q[0], dec)} ${c.ticker} (fee ${fee2})`);
  if (DRY || !wallet) return console.log('  dry run, not sent');
  const bal = await provider.getBalance(wallet.address);
  if (bal < amountIn + ethers.parseEther('0.001')) return mark(c.id, 'queued', null, null, 'treasury low on ETH');
  const tx = await router.exactInput({ path: path(fee2, token), recipient: c.wallet, amountIn, amountOutMinimum: minOut }, { value: amountIn });
  console.log('  tx', tx.hash);
  const rc = await tx.wait();
  if (rc.status !== 1) return mark(c.id, 'queued', tx.hash, null, 'swap reverted');
  const topic = ethers.id('Transfer(address,address,uint256)'), to = ethers.zeroPadValue(c.wallet, 32).toLowerCase();
  let got = 0n; for (const l of rc.logs) if (l.address.toLowerCase() === token.toLowerCase() && l.topics[0] === topic && l.topics[2].toLowerCase() === to) got += BigInt(l.data);
  await mark(c.id, 'settled', tx.hash, Number(ethers.formatUnits(got, dec)), null);
  console.log(`  settled: ${ethers.formatUnits(got, dec)} ${c.ticker} to ${c.wallet}`);
}
