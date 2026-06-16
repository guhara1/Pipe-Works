import type { Faq } from "@/data/services";

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs?.length) return null;
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={i} open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
