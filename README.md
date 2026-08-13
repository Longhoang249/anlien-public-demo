# ANLIEN Public Demo Shell

Interactive product showroom and platform-shell prototype for ANLIEN.

The prototype lets a Vietnamese F&B owner understand the daily value of three independent products before signing in:

- Marketing (`dong-goi-thuong-hieu`): kéo khách.
- Loyalty (`fnbanlien-play`): giữ khách.
- Ops (`fnbanlien-tu-van-hanh`): vận hành tốt hơn.

## Boundaries

- Deterministic synthetic demo data only.
- No real auth, SSO, Platform Core, cross-product API, Supabase mutation, or production integration.
- UI reads typed contracts through product adapter boundaries.
- Future adapters must consume versioned read projections owned by each product.

See [docs/ANLIEN_SHELL_INTEGRATION_READINESS.md](docs/ANLIEN_SHELL_INTEGRATION_READINESS.md) for the field-level integration map and intentional placeholders.

## Local validation

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm test
```

Demo routes:

- `/demo`
- `/demo/marketing`
- `/demo/loyalty`
- `/demo/ops`
- `/demo/day`

