# Contributing

The useful contributions, in order:

1. **Receipts that the reader gets wrong.** Open an issue with the merchant, what the reader read, and what it should have read. A photo helps, but strip anything personal from it first.
2. **Brands for the shelf.** A brand needs a stock that Robinhood has listed on chain. Open an issue with the brand, the ticker, and which proof routes make sense for it.
3. **Parser fixes.** `scan.html` holds the parser. Tests are receipts. Add the receipt that broke it alongside the fix.

What we do not want: rate changes in pull requests (those are announced first), anything that moves the keeper's funds, and rewrites of the theme.

Run it locally with `node serve.mjs 4880`. Commit messages are `type(scope): what changed`, lowercase.
