import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, PRODUCTS, type Product } from "./products";

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

function readLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l.slug === "string" && typeof l.size === "string" && l.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readLines);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart stays in memory
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const add = (slug: string, size: string, qty = 1) => {
      setLines((prev) => {
        const i = prev.findIndex((l) => l.slug === slug && l.size === size);
        if (i === -1) return [...prev, { slug, size, qty }];
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
    {
      slug: "crest-mug",
      name: PRODUCTS[0].name,
      size: "One size",
      qty: 2,
      price: PRODUCTS[0].price,
    },
    {
      slug: "premium-notebook",
      name: PRODUCTS[3].name,
      size: "One size",
      qty: 1,
      price: PRODUCTS[3].price,
    },
  ],
  total: 1247,
  placedAt: "2026-10-28T09:30:00.000Z",
  status: "Dispatched",
};
