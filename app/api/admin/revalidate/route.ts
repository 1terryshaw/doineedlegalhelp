export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "crypto";

// Admin-only on-demand cache-bust. Guarded by a dedicated REVALIDATE_SECRET
// Bearer token (fail-closed if unset) -- NOT public. Stamped by
// homeisr-purge-stamp-v1 (TDL #1262 / #1244): this repo's home page became ISR
// in the #1244 fan and had NO purge path, so a claim or a publish left `/` up to
// an hour stale with no way to evict it.
//
// Purges every expression of a listing's cached identity that EXISTS in THIS repo:
//   1. revalidateTag(`listing:${slug}`)                  -- the unstable_cache row tag
//      (inert here: this repo has no unstable_cache producer; kept for fleet parity)
//      (this repo calls no getEnrichment(), so there is no enrichment tag to purge
//       and stamping one with a guessed vertical would purge nothing)
//   2. revalidatePath(`/directory/${slug}`)              -- the rendered detail page
//   3. the HOME PAGE, which the #1244 fan made ISR -- see the end of POST()
//
// revalidatePath is the load-bearing one for ISR: a tag purge cannot evict a
// prerendered page that never read that tag. A LITERAL path with NO `type`
// argument is required -- revalidatePath(path, "page") emits `_N_T_/<path>/page`,
// which matches nothing (K32). Do not add a type argument.
//
// CROSS-MAJOR: revalidateTag's signature differs by Next major -- 14 takes (tag), 16
// takes (tag, profile). This repo is on Next 14, but the cast keeps the file portable
// to a 16 bump, where a bare 1-arg call is a hard TS2554 build failure.
//
// Body: { slugs: string[] }
const purgeTag = revalidateTag as unknown as (tag: string, profile?: { expire: number }) => void;

const MAX_SLUGS = 1000;

// `_` MUST be permitted -- most fleet slugs carry a source-tag segment like
// `-tx_bar_2026_05_14-`. No `/`, `.`, space or `%` is accepted, so the value can
// never escape the `/directory/` segment.
const SLUG_RE = /^[A-Za-z0-9_-]{1,200}$/;

function authorized(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false; // fail closed
  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const raw = (body as { slugs?: unknown })?.slugs;
  if (!Array.isArray(raw)) {
    return NextResponse.json({ error: "slugs[] required" }, { status: 400 });
  }
  if (raw.length === 0) {
    return NextResponse.json({ error: "slugs[] must contain at least one non-empty string" }, { status: 400 });
  }
  if (raw.length > MAX_SLUGS) {
    return NextResponse.json({ error: `too many slugs (max ${MAX_SLUGS})` }, { status: 400 });
  }
  const invalid = raw.filter((s) => typeof s !== "string" || !SLUG_RE.test(s));
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `invalid slug(s): ${invalid.slice(0, 5).map(String).join(", ")}${invalid.length > 5 ? ` (+${invalid.length - 5} more)` : ""}` },
      { status: 400 }
    );
  }
  const slugs = raw as string[];

  const errors: string[] = [];
  let revalidated = 0;
  for (const slug of slugs) {
    try {
      purgeTag(`listing:${slug}`, { expire: 0 });
      revalidatePath(`/directory/${slug}`);
      revalidated++;
    } catch (e) {
      errors.push(`${slug}: ${(e as Error)?.message || "unknown"}`);
    }
  }

  // THE HOME PAGE. `/` is ISR since the #1244 fan, so a claim or a publish changes
  // what it shows and purging only /directory/<slug> would leave it up to an hour
  // stale about a listing whose detail page was just corrected. Fired ONCE per
  // call, after the per-slug loop -- not once per slug.
  try {
    // This repo exports NO HOME_LISTINGS_TAG -- its home page is ISR by TIME only
    // (`export const revalidate = 3600`), with no tagged read to bind a purge to.
    // revalidatePath("/") is therefore the ONLY mechanism that can evict it, and a
    // tag purge stamped here for "parity" would be a purge path that purges nothing.
    //
    // ACCEPTED COST, stated: revalidatePath("/") invalidates the ROOT LAYOUT entry and
    // so evicts the whole route tree, not just `/` (measured 2026-09-22 on
    // doineedadrivinginstructor). Every tag-bearing repo in the fleet therefore uses the
    // TAG alone. Here there is no tag, so the choice is an over-broad purge or NO purge
    // path at all -- and no purge path is how a claim leaves `/` an hour stale.
    // The right fix is to give this repo a tagged home read; until then this is honest
    // and it is bounded (this vertical has a small route tree).
    revalidatePath("/");
  } catch (e) {
    errors.push(`home: ${(e as Error)?.message || "unknown"}`);
  }

  return NextResponse.json({ revalidated, home: true, errors });
}
