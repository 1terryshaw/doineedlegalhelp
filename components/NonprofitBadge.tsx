interface NonprofitBadgeProps {
  variant?: "nonprofit" | "eoir" | "legal-aid";
}

const LABELS = {
  nonprofit: "Nonprofit",
  eoir: "EOIR-Recognized",
  "legal-aid": "Legal Aid",
} as const;

export default function NonprofitBadge({ variant = "nonprofit" }: NonprofitBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold uppercase tracking-wide"
      title={`${LABELS[variant]} organization — service available at low or no cost.`}
    >
      <svg
        className="w-3 h-3"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {LABELS[variant]}
    </span>
  );
}
