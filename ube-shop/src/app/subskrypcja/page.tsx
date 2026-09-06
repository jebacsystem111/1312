import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { SubscribePlans } from "@/components/SubscribePlans";
import { batchLabel } from "@/lib/dates";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Subskrypcja",
  description:
    "Halaya z ube w lodówce na stałe. Dwa plany, wysyłka co miesiąc albo co kwartał, bez umowy.",
  alternates: { canonical: "/subskrypcja" },
};

const howItWorks = [
  {
    title: "Wybierasz plan i cykl",
    body: "Miesięcznie albo kwartalnie. Adres i sposób dostawy zapisujemy przy pierwszym zamówieniu.",
  },
  {
    title: "Gotujemy w noc przed wysyłką",
    body: "Garnek startuje o 6:00, a paczka jest pakowana, gdy masa wystygnie. Nie mrozimy zapasów.",
  },
  {
    title: "Pomijasz albo kończysz, gdy chcesz",
    body: "Zmiana do 5. dnia przed partią. Rezygnacja bez telefonu, jeden klik w mailu z potwierdzeniem.",
  },
];

const questions = [
  {
    q: "Czy mogę zmienić plan w trakcie?",
    a: "Tak. Z Słoika na Duży garnek przechodzisz od razu, w drugą stronę od następnej partii. Różnicę rozliczamy na następnej fakturze.",
  },
  {
    q: "Co, jeśli wyjadę?",
    a: "Pomiń wysyłkę do 5. dnia przed partią. Nie przepadnie - dołożymy ją do kolejnej paczki albo przesuniemy o miesiąc.",
  },
  {
    q: "Co, gdy partia się nie uda?",
    a: "Zdarza się, że bulwa jest za sucha i masa nie trzyma gęstości. Wtedy nie wysyłamy nic i informujemy, a opłacony miesiąc przechodzi na kolejną partię.",
  },
];

export default function SubscriptionPage() {
  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pt-16 lg:pb-20">
          <div className="lg:col-span-7">
            <h1 className="display-xl max-w-[13ch]">Słoik, o którym nie trzeba pamiętać</h1>
            <p className="mt-6 max-w-[52ch] text-[17.5px] leading-[1.55] text-ink-2">
              Halaya i jedna rzecz słodka, dobrane do cyklu, w jakim realnie je zjadacie. Bez umowy,
              bez telefonów, z możliwym pominięciem wysyłki.
            </p>
            <p className="mt-7 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-line bg-panel px-4 py-2 text-[14.5px]">
              Najbliższa partia: <span className="font-medium">{batchLabel()}</span>
              <Link
                href="/sklep"
                className="group inline-flex items-center gap-1.5 text-ube-deep hover:underline"
              >
                albo kup jednorazowo
                <ArrowRight size={15} className="transition-transform duration-[190ms] ease-[var(--ease-ui)] group-hover:translate-x-0.5" />
              </Link>
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-tile border border-line">
              <Image
                src="/img/jar-halaya.jpg"
                alt="Słoik halayi z łyżką drewnianą na jasnym blacie"
                width={900}
                height={900}
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="display-lg max-w-[16ch]">Jak to działa</h2>
        <ol className="mt-10 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {howItWorks.map((step, i) => (
            <Reveal as="li" key={step.title} delay={0.06 * i}>
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.025em]">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="display-lg max-w-[14ch]">Dwa plany</h2>
          <div className="mt-10 max-w-4xl">
            <SubscribePlans />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="display-md max-w-[16ch] lg:col-span-4">Zanim klikniesz</h2>
          <div className="lg:col-span-8">
            {questions.map((item, i) => (
              <details key={item.q} open={i === 0} className="group border-b border-line py-4 first:border-t">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16.5px] font-medium marker:hidden">
                  <span className="transition-colors duration-[150ms] group-hover:text-ube-deep">
                    {item.q}
                  </span>
                  <CaretDown
                    size={17}
                    className="mt-1 shrink-0 text-ink-3 transition-transform duration-[190ms] ease-[var(--ease-ui)] group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-[60ch] pt-2.5 text-[15.5px] leading-relaxed text-ink-2">
                  {item.a}
                </p>
              </details>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sklep"
                className={cn(
                  "inline-flex h-12 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15.5px] font-medium text-ube-on",
                  "transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]",
                )}
              >
                Najpierw spróbuję na spokojnie <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
