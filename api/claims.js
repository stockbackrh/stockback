// Stockback claims API (Vercel Node function). Verifies the wallet signature, recomputes the reward, stores via Supabase RPC.
const { ethers } = require('ethers');
const { SHELF, SB } = require('../shelf.js');
const SUPA = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_ANON_KEY, SECRET = process.env.STOCKBACK_API_SECRET;
async function supa(path, opts = {}) {
  const r = await fetch(SUPA + path, { ...opts, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(opts.headers || {}) } });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw Object.assign(new Error((j && (j.message || j.hint)) || t), { status: r.status, body: j });
  return j;
}
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', 'content-type'); res.setHeader('Cache-Control', 'no-store');
  if (!SUPA || !KEY || !SECRET) return res.status(500).json({ error: 'server not configured' });
  try {
    if (req.method === 'GET') {
      const w = String(req.query.wallet || '').toLowerCase();
      if (!/^0x[0-9a-f]{40}$/.test(w)) return res.status(400).json({ error: 'wallet' });
      const rows = await supa(`/rest/v1/stockback_claims?wallet=eq.${w}&order=created_at.desc&limit=50&select=id,merchant,ticker,total_usd,rate,reward_usd,route,status,reason,tx_hash,token_amount,created_at,settled_at`);
      return res.status(200).json({ ok: true, claims: rows });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const wallet = String(b.wallet || '').toLowerCase();
    if (!/^0x[0-9a-f]{40}$/.test(wallet)) return res.status(400).json({ error: 'wallet' });
    // signature binds wallet + fingerprint + time
    const msg = String(b.message || ''), sig = String(b.signature || '');
    const m = /^Stockback claim\nfingerprint: ([0-9a-f]{8,64})\ntime: (\d+)$/.exec(msg);
    if (!m) return res.status(400).json({ error: 'message' });
    if (m[1] !== String(b.fingerprint)) return res.status(400).json({ error: 'fingerprint' });
    if (Math.abs(Date.now() - Number(m[2])) > 10 * 60 * 1000) return res.status(400).json({ error: 'expired' });
    let signer; try { signer = ethers.verifyMessage(msg, sig).toLowerCase(); } catch { return res.status(400).json({ error: 'signature' }); }
    if (signer !== wallet) return res.status(401).json({ error: 'signature' });
    // recompute the reward from the shelf, never trust the client's number
    const brand = SHELF.find(x => x.name === b.merchant && x.ticker === b.ticker && !x.soon);
    if (!brand) return res.status(400).json({ error: 'not on the shelf' });
    const route = b.route === 'email' ? 'email' : 'paper';
    if (!brand.proof.includes(route)) return res.status(400).json({ error: `${brand.name} does not accept ${route}` });
    if (!(total > 0 && total < 100000)) return res.status(400).json({ error: 'total' });
    const reward = Math.round(SB.reward(total, brand, false) * 100) / 100;
    const row = await supa('/rest/v1/rpc/stockback_submit_claim', { method: 'POST', body: JSON.stringify({ p_secret: SECRET, p_wallet: wallet, p_merchant: brand.name, p_ticker: brand.ticker, p_token_address: SB.address(brand.ticker), p_total: total, p_rate: brand.rate, p_reward: reward, p_route: route, p_fingerprint: String(b.fingerprint), p_excerpt: String(b.excerpt || '').slice(0, 600) }) });
    return res.status(200).json({ ok: true, claim: row });
  } catch (e) {
    const t = String(e.message || e);
    if (/duplicate key|unique/i.test(t)) return res.status(409).json({ error: 'already claimed' });
    if (/daily limit/i.test(t)) return res.status(429).json({ error: 'three receipts a day' });
    return res.status(500).json({ error: t.slice(0, 200) });
  }
};
