# Plan: Simplify SHIMBA WiFi to match the reference `public/index.html`

## What the user wants
Looking at `server-2.zip/public/index.html`, the live portal is a **single page with two tabs**:
1. **Nunua Vocha** (Buy) — pick a package, enter phone, pay via Mongike, then poll until voucher is issued.
2. **Tumia Vocha** (Use) — enter a voucher code and check / use it.

No multi-page nav, no admin link on the portal, no separate routes. That's all real users need.

## Backend (already provided in zip — keep as-is)
The bundled `server.js` exposes exactly the endpoints we need. The site will call:

- `GET /packages` → list of packages
- `POST /pay-mongike` `{ amount, phone, package }` → returns `{ orderReference }`
- `GET /payment-status/:orderReference` → `{ status, voucherCode }` (poll every 4s)
- `GET /api/voucher-status/:code` → check a voucher

Base URL comes from `VITE_API_URL` (already in `.env` = `http://fi5.bot-hosting.net:22896`).

I will repackage the backend zip unchanged so the user can deploy it on Bot Hosting. No backend code changes needed — the endpoints already exist.

## Frontend changes (TanStack Start)

### Routes
- **Keep:** `src/routes/__root.tsx`, `src/routes/index.tsx`
- **Rewrite `index.tsx`** as the entire portal (header + 2 tabs + instructions), matching the dark cyan/blue design from the reference HTML.
- **Delete:** `src/routes/packages.tsx`, `src/routes/success.tsx`, `src/routes/voucher.tsx`, `src/routes/admin.tsx` (and their nav links). One page only.
- **Delete:** `Navbar.tsx`, `Footer.tsx`, `StatsCard.tsx`, `PackageCard.tsx` — no longer needed; the single page is self-contained.
- **Keep:** `LoadingSpinner.tsx`, shadcn `ui/*`.

### `index.tsx` structure
```text
Header (SHIMBA WiFi logo + "LIVE" badge)
Tabs: [ Nunua Vocha | Tumia Vocha ]

Tab 1 — Nunua:
  - Package <select> (loaded from GET /packages, fallback to 500/1000/2000/5000 TZS)
  - Phone <input> (Tanzania format)
  - Button "Lipa sasa" → POST /pay-mongike
  - On success: poll GET /payment-status/:ref every 4s (max ~2 min)
  - When status=paid: show voucher card with copy-to-clipboard + "Tumia sasa" button that switches to tab 2 with code prefilled

Tab 2 — Tumia:
  - Voucher <input>
  - Button "Angalia / Ingia" → GET /api/voucher-status/:code
  - Show status (valid / used / expired) and a "Ingia kwenye WiFi" link if hotspot URL is present

Bottom instructions block (Jinsi ya kuunganisha — same copy as reference)
```

### API layer
Rewrite `src/lib/api.ts` to only the 4 calls above. Remove admin/stats helpers.

### Styling
Use the same dark navy + cyan gradient palette from the reference (`#070b14` bg, `#22d3ee` primary, `#3b82f6` secondary) via Tailwind utilities + a small block of CSS variables in `src/styles.css`. Keep it minimal and mobile-first (max-width 520px container).

### Backend connectivity sanity
- `.env` already has `VITE_API_URL=http://fi5.bot-hosting.net:22896`.
- All fetches go through one `apiFetch()` helper that prepends `VITE_API_URL` and sets JSON headers.
- Note for the user: the backend must allow CORS from the Lovable preview/published domain (`Access-Control-Allow-Origin: *` or the specific origin). The provided `server.js` already mounts CORS-friendly routes, but if browser blocks calls, the fix is one line in `server.js`: `app.use(cors())`. I'll include that note when shipping.

## Deliverables
1. Simplified single-page portal live in the preview.
2. `shimba-wifi-backend.zip` re-zipped from the uploaded `server-2.zip` (unchanged) for Bot Hosting deploy.

Approve and I'll build it.
