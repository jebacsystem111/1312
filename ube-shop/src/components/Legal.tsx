import Link from "next/link";

export function Legal({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h1 className="display-lg max-w-[14ch]">{title}</h1>
          <p className="mt-5 max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">{intro}</p>
          <nav aria-label="Pozostałe dokumenty" className="mt-8 border-t border-line pt-5">
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/regulamin" className="text-ink hover:text-ube-deep">
                  Regulamin sklepu
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="text-ink hover:text-ube-deep">
                  Prywatność i cookies
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="rounded-card border border-line bg-ube-tint px-4 py-3 text-[14px] leading-relaxed text-ink-2">
            Szkic do podmiany: wzór na sklep z żywnością krótko terminową. Przed startem sprzedaży
            sprawdź go z prawnikiem i uzupełnij o dane spółki, numer rachunku i regulatora wysyłek.
          </p>

          {sections.map((s) => (
            <section key={s.h} className="mt-10 border-t border-line pt-7 first:border-0">
              <h2 className="font-display text-[21px] tracking-[-0.025em]">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.65] text-ink-2">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
