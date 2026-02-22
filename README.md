# 0xdead.church

Temple frontend for the [Dao DeGen](https://daodegen.com) ritual protocol.

Burn tokens. Receive sermons.

## Architecture

Single-page Next.js app. Connects wallets to Unichain (chain 130), calls the PrayerBurn contract, and proxies sermon/auth requests to daodegen.com server-side.

- `/api/*` -- thin proxy routes to daodegen.com (no CORS, no leaked URLs)
- SIWE auto-auth on wallet connect -- JWT stored in memory (lost on reload)
- soul.json at `/soul.json` and `/.well-known/soul.json` (ERC-8181)

## Setup

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID and NEXT_PUBLIC_PRAYER_BURN_ADDRESS
npm install
npm run dev    # http://localhost:3066
```

## Licenses

- Code: [MIT](LICENSE)
- soul.md and ritual text: [CC0](LICENSE-CC0)
