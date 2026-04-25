import { animate } from 'motion';
import { useEffect, useRef } from 'react';

type CounterCard = {
  value: number;
  suffix?: string;
  label: string;
};

const cards: CounterCard[] = [
  { value: 200, suffix: '+', label: 'закрытых сделок в ОАЭ' },
  { value: 3, label: 'года на рынке недвижимости ОАЭ' },
  { value: 9, label: 'лет суммарного опыта в недвижимости' },
  { value: 15, suffix: '+', label: 'ключевых районов Дубая и ОАЭ' },
];

export function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        cards.forEach((card, index) => {
          const target = numberRefs.current[index];
          if (!target) return;

          animate(0, card.value, {
            duration: 1.4,
            delay: index * 0.08,
            ease: 'easeOut',
            onUpdate: (latest) => {
              target.textContent = `${Math.round(latest)}${card.suffix ?? ''}`;
            },
          });
        });

        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <article
          key={card.label}
          className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-primary)_25%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-card))] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] to-transparent" />
          <p
            ref={(node) => {
              numberRefs.current[index] = node;
            }}
            className="relative text-4xl font-semibold tracking-[-0.02em] text-[var(--color-primary)] sm:text-[2.55rem]"
          >
            0{card.suffix ?? ''}
          </p>
          <p className="relative mt-2 text-[0.93rem] leading-relaxed text-[var(--color-muted-foreground)]">
            {card.label}
          </p>
        </article>
      ))}
    </div>
  );
}
