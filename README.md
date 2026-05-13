# DoINeedLegalHelp.org

Nonprofit legal aid, pro bono attorneys, and EOIR-recognized immigration organizations across the United States.

Forked 2026-05-13 from freelawyeradvice.ca as part of the legal umbrella build.
Reads/writes `legal_listings` + `legal_inquiries` in shared Supabase.

## Tech Stack
- Next.js 14.2.35, TypeScript, Tailwind
- Supabase (shared empire instance)
- Stripe (USD pricing per pricing-v2 2026-05-12)
- Claude AI (chat triage)

## Liability Posture
This site does **not** provide legal advice and does **not** create an attorney-client
relationship. See `app/terms/page.tsx` for the indemnification + arbitration + limitation
of liability stack. The `<Disclaimer/>` banner is rendered site-wide via `app/layout.tsx`.
