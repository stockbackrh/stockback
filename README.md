<p align="center">
  <img src="docs/banner.png" alt="StockBack" width="100%" />
</p>

<h3 align="center">Buy from the brand. Own the brand.</h3>

<p align="center">
  <a href="https://usestockback.xyz">usestockback.xyz</a> ·
  <a href="https://usestockback.xyz/app">Shelf</a> ·
  <a href="https://usestockback.xyz/scan">Scan</a> ·
  <a href="https://usestockback.xyz/docs">Docs</a> ·
  <a href="https://x.com/StockBackfam">@StockBackfam</a>
</p>

StockBack pays you in the stock of the company you just bought from. Photograph a receipt, or forward the order email, and a tokenized share of that brand lands in a wallet you control on Robinhood Chain. No points, no review queue, and the settlement time is printed on every brand.

## What is in this repo

| Path | What it is |
|---|---|
| `index.html`, `app.html`, `scan.html`, `token.html` | The site: landing, the shelf of brands, the receipt scanner, the token page |
| `docs.html`, `faq.html`, `terms.html`, `privacy.html`, `contact.html` | Documentation and legal |
| `shelf.js` | The shelf: every brand, its rate, what it accepts as proof, the stock token address on Robinhood Chain. Shared by the browser and the API |
| `wallet.js` | Injected EVM wallet connect for Robinhood Chain (chain id 4663), no SDK |
| `api/claims.js` | Claims API. Verifies the wallet signature, recomputes the reward from the shelf, stores the claim |
| `api/shelf.js` | Live settlement medians per ticker |
| `keeper/settle.mjs` | Settlement keeper. Buys the brand's tokenized share on Uniswap v3 and delivers it to the claimant in one transaction |
| `stockback.css`, `site.js` | Theme and landing behaviour on top of the base stylesheet |

## How a claim moves

1. The receipt is read in the browser with an OCR model. The merchant, the date and the total never leave the page until you file the claim.
2. Filing a claim means signing a short message with your wallet. The signature binds the wallet to the receipt's fingerprint, and the API rejects anything else.
3. The API recomputes the reward from the shelf, applies the caps, and writes the claim. One receipt, one reward. Three receipts a day per wallet.
4. The keeper picks up accepted claims, quotes ETH to USDG to the stock token, and sends the swap output straight to the claimant. The transaction hash is attached to the claim.

## Running it

```bash
npm install
node serve.mjs 4880            # static site + api stubs on http://localhost:4880
node keeper/settle.mjs --dry   # what the keeper would buy, without sending
```

The API and the keeper need `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `STOCKBACK_API_SECRET`. The keeper also needs `TREASURY_PK` for a wallet funded with ETH on Robinhood Chain.

## Caps and rates

Each brand sets its own rate, 1% to 5% of the receipt. Rewards are capped at $20 a receipt, or $100 when the wallet holds $STOCKBACK. Tokenized shares track the price of the underlying share and move in both directions. StockBack is not a broker, a bank or an exchange, and nothing here is investment advice.
