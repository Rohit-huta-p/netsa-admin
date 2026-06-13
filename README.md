# NETSA Admin

Internal tooling. v1 = the Reach Out list (founder outreach CRM). Not part of the user-facing product.

## Local dev

```bash
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, ADMIN_SEED_*
npm install
npm run seed:templates && npm run seed:admin
npm run dev            # API :4000, web :5173 (proxies /api)
```

## Production (single Node host — Render / Railway / Fly)

- Build command: `npm install && npm run build`
- Start command: `npm start`  (serves API + built client on one port)
- Env vars: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN` (set to the deployed URL), `ADMIN_SEED_*`
- After first deploy, run `npm run seed:admin` once (shell/one-off job) to create the owner.

## Data

Separate `netsa_admin` database on the existing Atlas cluster. No Redis.

## Contact links

WhatsApp (`wa.me`) and SMS prefill the chosen template. Instagram opens the DM and copies the
message to the clipboard (IG can't prefill). Any send stamps "contacted" + logs a note.
