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
  if (req.method === 'OPTIONS') return res.status(204).end();
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
