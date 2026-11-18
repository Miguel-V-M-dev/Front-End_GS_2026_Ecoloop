/**
 * Anel aberto da logo (o "zero" e o ciclo), usado só como detalhe de fundo.
 * A cor vem do `text-...` da classe, e ele fica atrás do conteúdo.
 */
export default function AnelDecor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className={className}>
      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="500 28"
        transform="rotate(-70 100 100)"
      />
    </svg>
  );
}
