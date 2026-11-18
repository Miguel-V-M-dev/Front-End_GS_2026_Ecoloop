import { useState } from "react";
import FaqItem from "../components/ui/FaqItem";
import PageHero from "../components/ui/PageHero";
import { faqEntradas } from "../data/faq";

export default function Faq() {
  // useState: guarda qual pergunta está aberta (só uma por vez).
  const [abertaId, setAbertaId] = useState<string | null>(faqEntradas[0]?.id ?? null);

  return (
    <>
      <PageHero titulo="Perguntas frequentes">
        <p>Dúvidas comuns sobre locais, registros, metas e como os números são calculados.</p>
      </PageHero>

      <div className="mx-auto max-w-3xl space-y-3 px-4 py-12 sm:px-6">
        {faqEntradas.map((entrada) => (
          <FaqItem
            key={entrada.id}
            entrada={entrada}
            aberta={abertaId === entrada.id}
            onAlternar={() => setAbertaId(abertaId === entrada.id ? null : entrada.id)}
          />
        ))}
      </div>
    </>
  );
}
