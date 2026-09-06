import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CookingPot } from "@phosphor-icons/react/dist/ssr";
import { AddToCart } from "@/components/AddToCart";
import { Faq } from "@/components/Faq";
import { Marquee } from "@/components/Marquee";
import { Newsletter } from "@/components/Newsletter";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealOnMount } from "@/components/Reveal";
import { SubscribePlans } from "@/components/SubscribePlans";
import { marquee, process as steps, reviews, site, values } from "@/lib/content";
import { productBySlug, products } from "@/lib/products";

export default function Page() {
  const hero = productBySlug("box-purpura")!;
  const grid = ["halaya-250", "lody-ube-450", "ciasto-warstwowe", "halo-halo-zestaw"]
    .map((s) => productBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: site.name,
            description: site.subclaim,
            telephone: site.phone,
            email: site.email,
            priceRange: "40-150 zł",
            address: { "@type": "PostalAddress", streetAddress: "ul. Wilcza 24", addressLocality: "Warszawa", addressCountry: "PL" },
            openingHours: ["Tu-Th 11:00-19:00", "Fr-Sa 11:00-21:00", "Su 12:00-17:00"],
          }),
        }}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-x-14 lg:px-8 lg:pt-14 lg:pb-24">
          <div className="lg:col-span-6 xl:col-span-5">
            <RevealOnMount>
              <h1 className="display-xl max-w-[13ch]">
                Fioletowy jam z prawdziwego ube
              </h1>
            </RevealOnMount>
            <RevealOnMount delay={0.08}>
              <p className="mt-6 max-w-[46ch] text-[17.5px] leading-[1.55] text-ink-2">
                Halaya z 6-godzinnego garnka, lody na śmietance i koncentrat do latte. Jeden garnek
                dziennie, wysyłka w 48 godzin.
              </p>
            </RevealOnMount>
            <RevealOnMount delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/sklep"
                  className="inline-flex h-13 items-center gap-2.5 rounded-full bg-ube-deep px-6 text-[16px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
                >
                  Przejdź do sklepu <ArrowRight size={18} />
                </Link>
                <Link
                  href="#proces"
                  className="inline-flex h-13 items-center gap-2 rounded-full border border-line px-5 text-[16px] font-medium text-ink transition-[border-color,background-color] duration-[190ms] ease-[var(--ease-ui)] hover:border-ube hover:bg-ube-tint"
                >
                  <CookingPot size={18} weight="duotone" /> Jak to powstaje
                </Link>
              </div>
            </RevealOnMount>
          </div>

          <div className="lg:col-span-6 xl:col-span-7">
            <RevealOnMount delay={0.1}>
              <figure className="relative">
                <div className="overflow-hidden rounded-tile border border-line bg-ube-tint">
                  <Image
                    src="/img/hero-sandwich.jpg"
                    alt="Dwa sandwichy lodowe z ube trzymane w dłoniach, ukruszone ciastko crinkle"
                    width={1000}
                    height={1250}
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -left-4 hidden w-36 overflow-hidden rounded-card border-4 border-paper shadow-[0_18px_40px_-22px_var(--ink)] sm:block lg:-left-10 lg:w-44">
                  <Image
                    src="/img/jar-halaya.jpg"
                    alt="Słoik halayi z fioletowym kremem i drewniana łyżka"
                    width={400}
                    height={400}
                    sizes="176px"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </figure>
            </RevealOnMount>
            <figcaption className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-ink-2 sm:pl-14">
              Zdjęcie z porannej partii: sandwich lodowy na cieście crinkle. Halaya i lody jadą w
              jednym opakowaniu chłodniczym, do 48 godzin od ognia.
            </figcaption>
          </div>
        </div>
      </section>

      <Marquee items={marquee} />

      {/* ---------------- SKLEP ---------------- */}
      <section id="sklep" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="display-lg max-w-[16ch]">Co dziś w sklepie</h2>
          <Link
            href="/sklep"
            className="group inline-flex items-center gap-2 pb-1 text-[15px] font-medium text-ink transition-colors duration-[150ms] hover:text-ube-deep"
          >
            Wszystkie {products.length} pozycje
            <ArrowRight size={16} className="transition-transform duration-[190ms] ease-[var(--ease-ui)] group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article className="flex h-full flex-col overflow-hidden rounded-tile border border-ube/30 bg-ube-tint sm:flex-row">
              <Link
                href={`/produkt/${hero.slug}`}
                tabIndex={-1}
                aria-hidden
                className="relative block aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-[46%]"
              >
                <Image
                  src={hero.image}
                  alt="Rozłożony box Purpura: słoik halayi, ciastka, proszek ube i karta przepisów"
                  fill
                  sizes="(min-width: 640px) 32vw, 100vw"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
                <h3 className="font-display text-[27px] leading-tight tracking-[-0.03em]">
                  <Link href={`/produkt/${hero.slug}`}>{hero.name}</Link>
                </h3>
                <p className="max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">
                  Cztery rzeczy na pierwszy raz, w pudełku, które nie zawiera plastiku. Najtańsza
                  droga do sprawdzenia, czy to Twój smak.
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-4">
                  <Price value={hero.price} compareAt={hero.compareAt} size="lg" />
                  <AddToCart slug={hero.slug} />
                </div>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-rows-2">
            {grid.map((p, i) => (
              <Reveal key={p.slug} delay={0.05 * (i + 1)} className="h-full">
                <ProductCard product={p} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROCES: sticky stack ---------------- */}
      <section id="proces" className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg max-w-[14ch]">Jeden garnek dziennie</h2>
              <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-ink-2">
                Od bulwy do słoika mijają dwa dni. Nie mamy maszyny do nabijania masy powietrzem ani
                baru z kolorami, więc to, co widzisz poniżej, jest całą technologią Purpury.
              </p>
            </div>
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-2 lg:col-span-6 lg:col-start-7 lg:pt-2">
              Ube przyjeżdża do nas w skrzynkach po 12 kg z tego samego gospodarstwa w Pangasinan.
              Obieramy je rano, gotujemy do wieczora, a w środę rano jedzie do Was. Dlatego stan
              w koszyku zmienia się w ciągu dnia i dlatego bywa, że czegoś nie ma.
            </p>
          </div>

          <div className="mt-14 lg:mt-20">
            {steps.map((step, i) => (
              <div key={step.title} className="stack-card pb-4" style={{ ["--i" as string]: i }}>
                <article className="grid overflow-hidden rounded-tile border border-line bg-panel md:grid-cols-2">
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(min-width: 768px) 46vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
                    <p className="text-[13.5px] text-ink-3">{step.meta}</p>
                    <h3 className="font-display text-[30px] leading-none tracking-[-0.03em]">
                      {step.title}
                    </h3>
                    <p className="max-w-[44ch] text-[16px] leading-relaxed text-ink-2">{step.body}</p>
                    <p className="mt-1 border-t border-line pt-4 font-display text-[17px] tracking-[-0.01em] text-ube-deep tnum">
                      {step.stat}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <ul className="mt-16 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v.title}>
                <h3 className="font-display text-[19px] tracking-[-0.02em]">{v.title}</h3>
                <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-2">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- SUBSKRYPCJA ---------------- */}
      <section id="subskrypcja" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <h2 className="display-lg max-w-[15ch]">Słoik w lodówce na stałe</h2>
            <p className="mt-5 max-w-[44ch] text-[16.5px] leading-relaxed text-ink-2">
              Zamawiasz raz, a halaya przyjeżdża co miesiąc albo co kwartał. Możesz pominąć wysyłkę,
              zmienić plan albo przestać, zanim partia trafi do garnka.
            </p>
            <div className="mt-8 overflow-hidden rounded-tile border border-line">
              <Image
                src="/img/box-flatlay.jpg"
                alt="Widok z góry: otwarte pudełko z słoikiem, ciastkami, proszkiem ube i kartą przepisów"
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <SubscribePlans />
          </div>
        </div>
      </section>

      {/* ---------------- OPINIE ---------------- */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="display-lg max-w-[18ch]">Co piszą po pierwszym słoiku</h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-x-14">
            <Reveal className="lg:col-span-7">
              <figure>
                <blockquote className="font-display text-[clamp(1.55rem,2.6vw,2.35rem)] leading-[1.18] tracking-[-0.025em]">
                  {"\u201E"}
                  {reviews[0].quote}
                  {"\u201D"}
                </blockquote>
                <figcaption className="mt-5 text-[14.5px] text-ink-2">
                  <span className="font-medium text-ink">{reviews[0].name}</span>
                  <span className="mx-2 text-line">|</span>
                  {reviews[0].role}
                </figcaption>
              </figure>
            </Reveal>
            <div className="grid gap-8 lg:col-span-5">
              {reviews.slice(1).map((r, i) => (
                <Reveal key={r.name} delay={0.06 * (i + 1)}>
                  <figure>
                    <blockquote className="max-w-[46ch] text-[16px] leading-relaxed text-ink-2">
                      {"\u201E"}
                      {r.quote}
                      {"\u201D"}
                    </blockquote>
                    <figcaption className="mt-3 text-[14px] text-ink-3">
                      <span className="font-medium text-ink">{r.name}</span>
                      <span className="mx-2 text-line">|</span>
                      {r.role}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- KAWIARNIA ---------------- */}
      <section id="kawiarnia" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-tile border border-line">
              <Image
                src="/img/store.jpg"
                alt="Wnętrze kawiarni Purpura: lastrico z fioletowym kruszywem, półki z słoikami, dwa krzesła"
                width={1500}
                height={1000}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="mt-3 text-[13.5px] text-ink-3">
              Siedem stolików, jedna lada. Halaya na wynos jest w lodówce po prawej.
            </p>
          </div>
          <div className="lg:col-span-5">
            <h2 className="display-lg max-w-[12ch]">Wilcza 24, od wtorku</h2>
            <dl className="mt-8 space-y-6">
              {site.hours.map((h) => (
                <div key={h.day} className="flex items-baseline justify-between gap-6 border-b border-line-soft pb-3">
                  <dt className="text-[15.5px] text-ink-2">{h.day}</dt>
                  <dd className="text-[15.5px] font-medium tnum">{h.time}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sklep"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 text-[15px] font-medium transition-[border-color,background-color] duration-[190ms] ease-[var(--ease-ui)] hover:border-ube hover:bg-ube-tint"
              >
                Zamów z odbiorem w kawiarni
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ + NEWSLETTER ---------------- */}
      <section id="faq" className="border-t border-line bg-paper-2">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-x-16 lg:px-8 lg:py-28">
          <div className="lg:col-span-7">
            <h2 className="display-lg max-w-[16ch]">Zanim zamówisz</h2>
            <Faq className="mt-10" />
          </div>
          <div className="lg:col-span-5">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
