import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "./products";

const CART_KEY = "ti-cart-v1";
const ORDERS_KEY = "ti-orders-v1";

export type CartLine = { slug: string; size: string; qty: number };

export type OrderItem = {
  slug: string;
  name: string;
  size: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  placedAt: string;
  status: string;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (slug: string, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Record<string, unknown>;
  const slug = o["slug"];
  const size = o["size"];
  const qty = o["qty"];
  return (
    typeof slug === "string" &&
    typeof size === "string" &&
    typeof qty === "number" &&
    qty > 0
  );
}

function readLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isLine) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty so the first render matches SSR; load stored lines after hydration.
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart stays in memory
    }
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const add = (slug: string, size: string, qty = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.slug === slug && l.size === size);
        if (!existing) return [...prev, { slug, size, qty }];
        return prev.map((l) =>
          l.slug === slug && l.size === size ? { ...l, qty: l.qty + qty } : l,
        );
      });
    };

    const setQty = (slug: string, size: string, qty: number) => {
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => !(l.slug === slug && l.size === size))
          : prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
      );
    };

    const remove = (slug: string, size: string) => {
      setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size)));
    };

    const clear = () => setLines([]);

    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => {
      const p = getProduct(l.slug);
      return p ? n + p.price * l.qty : n;
    }, 0);

    return { lines, count, subtotal, add, setQty, remove, clear };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOrders();
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));
  } catch {
    // storage unavailable
  }
}

export const DEMO_ORDER_ID = "TI-2026-1042";

export const DEMO_ORDER: Order = {
  id: DEMO_ORDER_ID,
  items: [
    { slug: "crest-mug", name: "Crest Mug", size: "One size", qty: 2, price: 449 },
    {
      slug: "premium-notebook",
      name: "Premium Notebook",
      size: "One size",
      qty: 1,
      price: 349,
    },
  ],
  total: 1247,
  placedAt: "2026-10-28T09:30:00.000Z",
  status: "Dispatched",
};
