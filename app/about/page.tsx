import { Metadata } from "next";
import Link from "next/link";
import verticalConfig from "@/lib/vertical.config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${verticalConfig.name} — free and low-cost legal help.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-3">About {verticalConfig.name}</h1>
        <p className="text-lg text-gray-700">
          A directory of nonprofit and low-cost legal resources across the United States.
        </p>
      </header>

      <section className="space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Who we serve</h2>
        <p>
          People who can&apos;t afford a private attorney, or who need help from a nonprofit
          legal-aid society, pro bono program, or accredited representative. Many of the
          organizations listed here help with immigration, family, housing, domestic violence,
          public benefits, consumer protection, and re-entry matters.
        </p>
      </section>

      <section className="space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Data sources</h2>
        <p>
          Our nonprofit and immigration-aid listings are anchored in the U.S. Department of
          Justice Executive Office for Immigration Review (EOIR) roster of recognized
          organizations and accredited representatives, supplemented by state and county
          legal-aid society rosters and pro bono program directories. See{" "}
          <Link href="/nonprofits" className="underline">our Nonprofits page</Link>.
        </p>
      </section>

      <section className="space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">What we are not</h2>
        <p>
          We are not a law firm. We do not provide legal advice. We do not vet the
          organizations we list &mdash; you are responsible for confirming the program is
          currently active and that it serves your county and matter type. EOIR recognition
          and accreditation can change; check{" "}
          <a
            href="https://www.justice.gov/eoir/recognition-and-accreditation-program"
            className="underline"
            style={{ color: verticalConfig.primaryColor }}
            rel="noopener"
          >
            justice.gov
          </a>{" "}
          for the live roster.
        </p>
      </section>

      <section className="space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Companion sites</h2>
        <p>
          For the full directory of private attorneys, see{" "}
          <a
            href="https://doineedlegal.com"
            className="underline"
            style={{ color: verticalConfig.primaryColor }}
            rel="noopener"
          >
            DoINeedLegal.com
          </a>
          . For AI-driven triage, see{" "}
          <a
            href="https://doineedlegaladvice.com"
            className="underline"
            style={{ color: verticalConfig.primaryColor }}
            rel="noopener"
          >
            DoINeedLegalAdvice.com
          </a>
          .
        </p>
        <p>
          See our <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </section>
    </div>
  );
}
