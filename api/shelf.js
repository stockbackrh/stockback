// Live settlement numbers for the shelf: median seconds per ticker over settled claims, plus totals.
const SUPA = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_ANON_KEY;
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
  try {
    const h = { apikey: KEY, Authorization: 'Bearer ' + KEY };
    const [med, tot] = await Promise.all([
      fetch(SUPA + '/rest/v1/stockback_settlement?select=ticker,settled,median_seconds', { headers: h }).then(r => r.json()),
      fetch(SUPA + '/rest/v1/stockback_claims?select=status,reward_usd', { headers: h }).then(r => r.json())
    ]);
    const totals = { claims: 0, settled: 0, paid_usd: 0 };
    for (const c of tot || []) { totals.claims++; if (c.status === 'settled') { totals.settled++; totals.paid_usd += Number(c.reward_usd); } }
    res.status(200).json({ ok: true, medians: med || [], totals });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
