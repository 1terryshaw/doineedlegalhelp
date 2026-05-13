import { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin, LISTINGS_TABLE } from "@/lib/supabase";
import verticalConfig from "@/lib/vertical.config";
import NonprofitBadge from "@/components/NonprofitBadge";

export const metadata: Metadata = {
  title: "Nonprofits & Legal Aid",
  description: `Free and low-cost legal help: nonprofit legal aid, pro bono programs, and EOIR-recognized organizations on ${verticalConfig.name}.`,
};

export const dynamic = "force-dynamic";

interface NonprofitListing {
  slug: string;
  name: string;
  business_name: string | null;
  city: string | null;
  state_province: string | null;
  phone: string | null;
  website: string | null;
  source: string | null;
  services: string[] | null;
}

const PAGE_LIMIT = 100;

export default async function NonprofitsPage() {
  const { data } = await supabaseAdmin
    .from(LISTINGS_TABLE)
    .select("slug, name, business_name, city, state_province, phone, website, source, services")
    .eq("country", "US")
    .or("source.like.eoir%,services.cs.{nonprofit_legal_aid}")
    .order("state_province", { ascending: true })
    .order("city", { ascending: true })
    .limit(PAGE_LIMIT);

  const listings = (data ?? []) as NonprofitListing[];
  const grouped = listings.reduce<Record<string, NonprofitListing[]>>((acc, l) => {
    const key = l.state_province || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-3">Nonprofits &amp; Legal Aid</h1>
        <p className="text-lg text-gray-700">
          Organizations offering free or low-cost legal help. Many are EOIR-recognized for
          immigration matters; others serve broader civil legal-aid needs (housing, family,
          consumer, public benefits).
        </p>
        <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Always call ahead to confirm the organization currently serves your county and matter
          type. Recognition and program eligibility can change.
        </p>
      </header>

      {listings.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p>We&apos;re still loading our nonprofit roster. Check back shortly.</p>
          <p className="mt-2 text-sm">
            In the meantime, the live EOIR roster is at{" "}
            <a
              href="https://www.justice.gov/eoir/recognition-and-accreditation-program"
              className="underline"
              style={{ color: verticalConfig.primaryColor }}
              rel="noopener"
            >
              justice.gov
            </a>
            .
          </p>
        </div>
      )}

      {Object.entries(grouped).map(([state, items]) => (
        <section key={state} className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-1">
            {state}
          </h2>
          <ul className="space-y-3">
            {items.map((l) => (
              <li
                key={l.slug}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link
                      href={`/directory/${l.slug}`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      {l.business_name || l.name}
                    </Link>
                    {l.source?.startsWith("eoir") ? (
                      <NonprofitBadge variant="eoir" />
                    ) : (
                      <NonprofitBadge variant="nonprofit" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {[l.city, l.state_province].filter(Boolean).join(", ")}
                  </div>
                </div>
                <div className="text-sm text-gray-600 sm:text-right space-y-0.5">
                  {l.phone && <div>{l.phone}</div>}
                  {l.website && (
                    <div>
                      <a
                        href={l.website}
                        rel="noopener"
                        className="underline"
                        style={{ color: verticalConfig.primaryColor }}
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
