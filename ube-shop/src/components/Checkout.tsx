"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_FROM, SHIPPING, type ShippingId } from "@/lib/products";
import { site } from "@/lib/content";
import { zl } from "@/lib/format";
import { cn } from "@/lib/cn";

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const CODE = /^\d{2}-\d{3}$/;

type Fields = {
  email: string;
  phone: string;
  name: string;
  street: string;
  code: string;
  city: string;
};

type Errors = Partial<Record<keyof Fields | "terms", string>>;

const payments = [
  { id: "blik", label: "BLIK", note: "Kod z aplikacji banku, 60 sekund na potwierdzenie" },
  { id: "card", label: "Karta", note: "Pobranie natychmiast, zwrot w 3 dni robocze" },
  { id: "transfer", label: "Przelew", note: "Dane do wpłaty w mailu, partia rusza po zaksięgowaniu" },
  { id: "cash", label: "Gotówka kurierowi", note: "Tylko kurier chłodniczy, do 400 zł" },
] as const;

export function Checkout() {
  const { ready, count, lines, subtotal, discount, shippingCost, total, shippingId, setShippingId, promo, note, gift, clear } =
    useCart();
  const [f, setF] = useState<Fields>({ email: "", phone: "", name: "", street: "", code: "", city: "" });
  const [payment, setPayment] = useState<(typeof payments)[number]["id"]>("blik");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [order, setOrder] = useState("");

  const set = (key: keyof Fields) => (value: string) => {
    setF((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const needsAddress = shippingId !== "pickup";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!EMAIL.test(f.email.trim())) next.email = "Podaj adres, na który wyślemy potwierdzenie.";
    if (f.phone.replace(/\D/g, "").length < 9) next.phone = "Nummer z 9 cyframi, żeby kurier mógł zadzwonić.";
    if (f.name.trim().split(/\s+/).length < 2) next.name = "Imię i nazwisko, jak na dowodzie.";
    if (needsAddress && f.street.trim().length < 3) next.street = "Ulica i numer domu albo lokalu.";
    if (needsAddress && !CODE.test(f.code.trim())) next.code = "Format 00-000.";
    if (needsAddress && f.city.trim().length < 2) next.city = "Miejscowość dostawy.";
    if (!terms) next.terms = "Bez zgody na regulamin nie możemy wysłać paczki.";

    setErrors(next);
    const firstKey = Object.keys(next)[0];
    if (firstKey) {
      const el = document.getElementById(firstKey === "terms" ? "terms-box" : firstKey);
      el?.focus();
      el?.scrollIntoView({ block: "center" });
      return;
    }

    setStatus("sending");
    window.setTimeout(() => {
      const stamp = new Date();
      setOrder(
        `PUR-${String(stamp.getFullYear()).slice(2)}${String(stamp.getMonth() + 1).padStart(2, "0")}-${String(
          100 + ((stamp.getHours() * 60 + stamp.getMinutes()) % 899),
        )}`,
      );
      setStatus("done");
      clear();
    }, 1300);
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
        <div className="h-9 w-44 animate-pulse rounded-full bg-ube-tint" />
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-tile bg-paper-2" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-tile bg-paper-2 lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="mx-auto grid max-w-[1400px] items-start gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-2.5 text-[15px] font-medium text-ube-deep">
            <CheckCircle size={20} weight="fill" /> Zamówienie przyjęte
          </p>
          <h1 className="display-lg mt-5 max-w-[16ch]">
            Numer <span className="tnum">{order}</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-ink-2">
            Potwierdzenie poszło na {f.email || "Twój adres"}. {SHIPPING[shippingId].eta}.{" "}
            {needsAddress
              ? `Paczka jedzie na ${f.street.trim()}, ${f.code.trim()} ${f.city.trim()}.`
              : "Po odbiór zapraszamy na Wilczą, powiadomimy SMS-em, gdy będzie gotowy."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sklep"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15.5px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
            >
              Wróć do sklepu <ArrowRight size={17} />
            </Link>
            <a
              href={`mailto:${site.email}?subject=Purpura%20${order}`}
              className="inline-flex h-12 items-center rounded-full border border-line px-5 text-[15.5px] font-medium transition-colors duration-[190ms] hover:border-ube"
            >
              Coś nie tak z zamówieniem
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <dl className="rounded-tile border border-line bg-panel p-6 text-[15px]">
            <div className="flex justify-between gap-4 border-b border-line-soft pb-3">
              <dt className="text-ink-2">Płatność</dt>
              <dd>{payments.find((p) => p.id === payment)?.label}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line-soft py-3">
              <dt className="text-ink-2">Dostawa</dt>
              <dd>{SHIPPING[shippingId].label}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-ink-2">Do zapłaty</dt>
              <dd className="font-medium tnum">{zl(total)}</dd>
            </div>
            {note && (
              <div className="mt-2 border-t border-line-soft pt-3">
                <dt className="text-ink-2">Kartka</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed">„{note}”</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-3">
            <Clock size={15} className="mt-0.5 shrink-0" aria-hidden />
            Zmiana albo anulowanie możliwe, dopóki partia nie trafi do garnka. Odpisz na maila z
            zamówieniem.
          </p>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <h1 className="display-lg max-w-[15ch]">Nie ma czego wysyłać</h1>
        <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-ink-2">
          Koszyk jest pusty, więc formularz nie miałby czego dotyczy. Wybierz przynajmniej słoik, a
          wrócimy do danych i płatności.
        </p>
        <Link
          href="/sklep"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15.5px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
        >
          Przejdź do sklepu <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <h1 className="display-lg">Zamówienie</h1>
        <Link href="/koszyk" className="text-[14.5px] text-ink-2 underline decoration-line underline-offset-4 hover:text-ube-deep">
          Edytuj koszyk
        </Link>
      </div>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-x-14">
        <div className="space-y-10 lg:col-span-7">
          <fieldset>
            <legend className="font-display text-[22px] tracking-[-0.025em]">Dane do kontaktu</legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                id="email"
                label="E-mail"
                type="email"
                autoComplete="email"
                value={f.email}
                onChange={set("email")}
                error={errors.email}
                hint="Potwierdzenie i numer listu"
              />
              <Field
                id="phone"
                label="Telefon"
                type="tel"
                autoComplete="tel"
                value={f.phone}
                onChange={set("phone")}
                error={errors.phone}
                hint="Kurier dzwoni przed wejściem na klatkę"
              />
              <div className="sm:col-span-2">
                <Field
                  id="name"
                  label="Imię i nazwisko"
                  autoComplete="name"
                  value={f.name}
                  onChange={set("name")}
                  error={errors.name}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-[22px] tracking-[-0.025em]">Dostawa</legend>
            <div className="mt-6 space-y-2.5">
              {(Object.keys(SHIPPING) as ShippingId[]).map((id) => {
                const opt = SHIPPING[id];
                const active = shippingId === id;
                const free = subtotal - discount >= FREE_SHIPPING_FROM || opt.price === 0;
                return (
                  <label
                    key={id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-card border px-4 py-3.5",
                      "transition-[border-color,background-color] duration-[190ms] ease-[var(--ease-ui)]",
                      active ? "border-ube bg-ube-tint" : "border-line hover:border-ube/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="dostawa"
                      value={id}
                      checked={active}
                      onChange={() => setShippingId(id)}
                      className="h-4 w-4 accent-[var(--ube)]"
                    />
                    <span className="flex-1">
                      <span className="block text-[15.5px] font-medium">{opt.label}</span>
                      <span className="block text-[13.5px] text-ink-3">{opt.eta}</span>
                    </span>
                    <span className={cn("text-[15px] font-medium tnum", free && "text-ube-deep")}>
                      {free ? "Gratis" : zl(opt.price)}
                    </span>
                  </label>
                );
              })}
            </div>

            {needsAddress ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto]">
                <div className="grid gap-5">
                  <Field
                    id="street"
                    label="Ulica i numer"
                    autoComplete="street-address"
                    value={f.street}
                    onChange={set("street")}
                    error={errors.street}
                  />
                  <Field
                    id="city"
                    label="Miejscowość"
                    autoComplete="address-level2"
                    value={f.city}
                    onChange={set("city")}
                    error={errors.city}
                  />
                </div>
                <Field
                  id="code"
                  label="Kod pocztowy"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  value={f.code}
                  onChange={set("code")}
                  error={errors.code}
                  hint="00-000"
                  className="sm:w-40"
                />
              </div>
            ) : (
              <p className="mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-ink-2">
                Odbiór na Wilczej 24. Powiadomimy SMS-em, gdy paczka będzie stała przy ladzie, masz
                dwa dni na przyjście.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className="font-display text-[22px] tracking-[-0.025em]">Płatność</legend>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {payments.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3.5 rounded-card border px-4 py-3.5",
                    "transition-[border-color,background-color] duration-[190ms] ease-[var(--ease-ui)]",
                    payment === p.id ? "border-ube bg-ube-tint" : "border-line hover:border-ube/50",
                  )}
                >
                  <input
                    type="radio"
                    name="platnosc"
                    value={p.id}
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="mt-0.5 h-4 w-4 accent-[var(--ube)]"
                  />
                  <span>
                    <span className="block text-[15.5px] font-medium">{p.label}</span>
                    <span className="block text-[13.5px] leading-snug text-ink-3">{p.note}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-tile border border-line bg-panel p-5">
            <label className="flex cursor-pointer items-start gap-3.5">
              <input
                id="terms-box"
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-0.5 h-4 w-4 accent-[var(--ube)]"
              />
              <span className="text-[14.5px] leading-relaxed text-ink-2">
                Akceptuję{" "}
                <Link href="/regulamin" className="text-ink underline decoration-line underline-offset-4 hover:text-ube-deep">
                  regulamin
                </Link>{" "}
                i wiem, że żywność krótko terminową przyjmujemy do reklamacji tylko w opakowaniu
                oryginalnym.
              </span>
            </label>
            {errors.terms && (
              <p role="alert" className="mt-2.5 flex items-center gap-1.5 text-[13.5px] text-ube-deep">
                <WarningCircle size={15} aria-hidden /> {errors.terms}
              </p>
            )}
          </div>
        </div>

        {/* --- podsumowanie --- */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-tile border border-line bg-panel p-6">
              <h2 className="font-display text-[21px] tracking-[-0.02em]">W paczce</h2>
              <ul className="mt-4 space-y-3.5">
                {lines.map((line) => (
                  <li key={line.slug} className="flex items-baseline justify-between gap-4 text-[15px]">
                    <span className="min-w-0 flex-1 truncate">
                      {line.name}
                      <span className="text-ink-3"> × {line.qty}</span>
                    </span>
                    <span className="tnum">{zl(line.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Suma częściowa</dt>
                  <dd className="tnum">{zl(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between gap-4 text-ube-deep">
                    <dt>Rabat {promo?.code}</dt>
                    <dd className="tnum">-{zl(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Dostawa</dt>
                  <dd className={cn("tnum", shippingCost === 0 && "text-ube-deep")}>
                    {shippingCost === 0 ? "Gratis" : zl(shippingCost)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-3 font-display text-[20px] tracking-[-0.02em]">
                  <dt>Razem</dt>
                  <dd className="tnum">{zl(total)}</dd>
                </div>
              </dl>

              {(note || gift) && (
                <div className="mt-4 border-t border-line pt-4 text-[14px] leading-relaxed text-ink-2">
                  {gift && <p className="font-medium text-ink">Paczka na prezent, bez cen na paragonie.</p>}
                  {note && <p className="mt-1">Kartka: „{note}”</p>}
                  <Link href="/koszyk" className="mt-1.5 inline-block underline decoration-line underline-offset-4 hover:text-ube-deep">
                    Zmień
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className={cn(
                  "mt-6 inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-ube-deep text-[16px] font-medium text-ube-on",
                  "transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98] disabled:opacity-85",
                )}
              >
                {status === "sending" ? (
                  <>
                    <SpinnerGap size={18} className="animate-spin" aria-hidden /> Rezerwujemy partię
                  </>
                ) : (
                  <>
                    Złóż zamówienie <ArrowRight size={17} />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-3">
                Płatność u nas obsługuje przelewy24. Rezygnacja do 5. dnia, przed startem partii.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  autoComplete,
  inputMode,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "email";
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="text-[14.5px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 rounded-card border bg-paper px-4 text-[15.5px] text-ink outline-none",
          "transition-[border-color,box-shadow] duration-[190ms] ease-[var(--ease-ui)]",
          error ? "border-ube-deep" : "border-line focus:border-ube",
        )}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[13.5px] leading-snug text-ube-deep">
          <WarningCircle size={15} className="mt-px shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13.5px] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
