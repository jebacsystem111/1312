"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  FREE_SHIPPING_FROM,
  PROMOS,
  SHIPPING,
  productBySlug,
  type ShippingId,
} from "./products";

export type Line = { slug: string; qty: number };

export type CartLine = Line & {
  name: string;
  price: number;
  weight: string;
  image: string;
  stock: number;
  lineTotal: number;
};

type PromoState = { code: string; off: number; label: string } | null;

type CartApi = {
  ready: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  freeShippingLeft: number;
  shippingId: ShippingId;
  promo: PromoState;
  note: string;
  setNote: (value: string) => void;
  gift: boolean;
  setGift: (value: boolean) => void;
  isOpen: boolean;
  bump: number;
  open: () => void;
  close: () => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setShippingId: (id: ShippingId) => void;
  applyPromo: (raw: string) => { ok: boolean; message: string };
  clearPromo: () => void;
};

const KEY = "purpura:cart:v3";
const CartCtx = createContext<CartApi | null>(null);

const clampQty = (qty: number, stock: number) => Math.max(1, Math.min(qty, Math.max(stock, 1)));

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [shippingId, setShippingId] = useState<ShippingId>("inpost");
  const [promo, setPromo] = useState<PromoState>(null);
  const [note, setNote] = useState("");
  const [gift, setGift] = useState(false);

  // Odczyt z localStorage dopiero po hydratacji, żeby nie było mismatchu.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { lines?: Line[]; note?: string; gift?: boolean };
        setLines(
          (saved.lines ?? [])
            .filter((l) => productBySlug(l.slug))
            .map((l) => ({ slug: l.slug, qty: Math.max(1, Number(l.qty) || 1) })),
        );
        setNote(typeof saved.note === "string" ? saved.note : "");
        setGift(Boolean(saved.gift));
      }
    } catch {
      // uszkodzony klucz - zaczynamy od pustego koszyka, nie wywalamy strony
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ lines, note, gift }));
    } catch {
      // tryb prywatny / brak quota: koszyk działa dalej w pamięci
    }
  }, [lines, note, gift, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    const product = productBySlug(slug);
    if (!product) return;
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: clampQty(l.qty + qty, product.stock) } : l,
        );
      }
      return [...prev, { slug, qty: clampQty(qty, product.stock) }];
    });
    setBump((b) => b + 1);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const product = productBySlug(slug);
    if (!product) return;
    if (qty <= 0) {
      setLines((prev) => prev.filter((l) => l.slug !== slug));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, qty: clampQty(qty, product.stock) } : l)),
    );
  }, []);

  const remove = useCallback(
    (slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
    [],
  );

  const clear = useCallback(() => {
    setLines([]);
    setPromo(null);
  }, []);

  const { cartLines, count, subtotal } = useMemo(() => {
    const cartLines: CartLine[] = [];
    let count = 0;
    let subtotal = 0;
    for (const l of lines) {
      const p = productBySlug(l.slug);
      if (!p) continue;
      const qty = clampQty(l.qty, p.stock);
      cartLines.push({
        slug: p.slug,
        qty,
        name: p.name,
        price: p.price,
        weight: p.weight,
        image: p.image,
        stock: p.stock,
        lineTotal: p.price * qty,
      });
      count += qty;
      subtotal += p.price * qty;
    }
    return { cartLines, count, subtotal };
  }, [lines]);

  const discount = promo ? Math.round(subtotal * promo.off) : 0;
  const base = subtotal - discount;
  const shippingCost =
    count === 0 || shippingId === "pickup" || base >= FREE_SHIPPING_FROM
      ? 0
      : SHIPPING[shippingId].price;
  const total = count === 0 ? 0 : base + shippingCost;
  const freeShippingLeft = Math.max(0, FREE_SHIPPING_FROM - base);

  const applyPromo = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      if (!code) return { ok: false, message: "Wpisz kod." };
      const found = PROMOS[code];
      if (!found) return { ok: false, message: "Taki kod nie działa albo wygasł." };
      setPromo({ code, ...found });
      return { ok: true, message: found.label };
    },
    [],
  );

  const value: CartApi = {
    ready,
    lines: cartLines,
    count,
    subtotal,
    discount,
    shippingCost,
    total,
    freeShippingLeft,
    shippingId,
    promo,
    note,
    setNote,
    gift,
    setGift,
    isOpen,
    bump,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add,
    setQty,
    remove,
    clear,
    setShippingId,
    applyPromo,
    clearPromo: () => setPromo(null),
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart musi być wewnątrz <CartProvider>");
  return ctx;
}
