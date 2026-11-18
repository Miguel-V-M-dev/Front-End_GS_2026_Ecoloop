/** Marca do Ecoloop: um anel aberto (o "zero" e o ciclo) com uma gota dentro. */
export default function Logo({ className = "h-8 w-8", gotaClasse = "fill-agua" }: { className?: string; gotaClasse?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="66 9"
        transform="rotate(-70 16 16)"
      />
      <path d="M16 9.5c3 3.6 4.9 6 4.9 8.6a4.9 4.9 0 0 1-9.8 0c0-2.6 1.9-5 4.9-8.6z" className={gotaClasse} />
    </svg>
  );
}
