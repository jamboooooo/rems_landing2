import { useMemo, useState } from 'react';

type OfficeSlide = {
  src: string;
  alt: string;
  title: string;
  note: string;
};

const slides: OfficeSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
    alt: 'Переговорная зона офиса',
    title: 'Переговорная зона',
    note: 'Проводим консультации и обсуждаем стратегию сделки в комфортной обстановке.',
  },
  {
    src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
    alt: 'Рабочее пространство команды',
    title: 'Рабочее пространство',
    note: 'Команда анализирует рынок, подбирает объекты и готовит персональные подборки.',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
    alt: 'Зона приема клиентов',
    title: 'Зона приема клиентов',
    note: 'Здесь встречаем клиентов и сопровождаем сделки от консультации до подписания.',
  },
  {
    src: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80',
    alt: 'Офисный лаунж',
    title: 'Офисный лаунж',
    note: 'Спокойное пространство для общения, согласования деталей и принятия решений.',
  },
];

export function OfficeCarousel() {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const current = useMemo(() => slides[index], [index]);

  const prev = () => {
    setIndex((value) => (value === 0 ? total - 1 : value - 1));
  };

  const next = () => {
    setIndex((value) => (value === total - 1 ? 0 : value + 1));
  };

  return (
    <div className="office-carousel rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border))] bg-[var(--color-card)] p-3 sm:p-4">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)]">
        <img
          src={current.src}
          alt={current.alt}
          loading="lazy"
          className="h-[16rem] w-full object-cover sm:h-[20rem] lg:h-[24rem]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-white sm:p-6">
          <p className="text-xs font-medium tracking-[0.08em] uppercase text-white/80">Наш офис</p>
          <h3 className="mt-1 text-xl font-semibold">{current.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-white/85 sm:text-base">{current.note}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Открыть слайд ${slideIndex + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                slideIndex === index
                  ? 'w-8 bg-[var(--color-primary)]'
                  : 'w-2.5 bg-[color-mix(in_srgb,var(--color-muted-foreground)_28%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-muted-foreground)_45%,transparent)]'
              }`}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
            aria-label="Предыдущий слайд"
          >
            &#8592;
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
            aria-label="Следующий слайд"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}
