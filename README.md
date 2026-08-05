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
| `index.html`, `app.html`, `scan.html`, `token.html` | The site: landing, the shelf of brands, the receipt scanner, the token page |
| `docs.html`, `faq.html`, `terms.html`, `privacy.html`, `contact.html` | Documentation and legal |
| `shelf.js` | The shelf: every brand, its rate, what it accepts as proof, the stock token address on Robinhood Chain. Shared by the browser and the API |
| `wallet.js` | Injected EVM wallet connect for Robinhood Chain (chain id 4663), no SDK |
| `api/claims.js` | Claims API. Verifies the wallet signature, recomputes the reward from the shelf, stores the claim |
