import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package, Search, Truck } from "lucide-react";
import { useState } from "react";
import { DEMO_ORDER, DEMO_ORDER_ID, getOrders, type Order } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/track-order")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" && search.id ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Order — Thapar Institute Campus Store" },
      {
        name: "description",
        content: "Track your Thapar Institute merchandise order.",
      },
      { property: "og:title", content: "Track Order — Thapar Institute Campus Store" },
      {
        property: "og:description",
        content: "Track your Thapar Institute merchandise order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackOrderPage,
});

const STAGES = ["Order placed", "Packed", "Dispatched", "Out for delivery", "Delivered"];

function Timeline({ order }: { order: Order }) {
  const current = Math.max(0, STAGES.indexOf(order.status));
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
          <p className="font-display text-xl font-bold tracking-tight">{order.id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="font-display text-xl font-bold">{formatINR(order.total)}</p>
        </div>
      </div>
      <ul className="mt-8 space-y-0">
        {STAGES.map((stage, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={stage} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    done || active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                {i < STAGES.length - 1 && (
                  <span
                    className={`w-px flex-1 ${done ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
              <div className={i < STAGES.length - 1 ? "pb-7" : ""}>
                <p
                  className={`text-sm font-semibold ${
                    active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage}
                  {active && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      Current
                    </span>
                  )}
                </p>
                {active && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stage === "Dispatched"
                      ? "Left the campus store — arriving in 2–3 days."
                      : stage === "Packed"
                        ? "Packed at the campus store, dispatching soon."
                        : "We'll update you at every step."}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="mt-6 space-y-2 border-t border-border pt-5">
        {order.items.map((item) => (
          <li key={`${item.slug}-${item.size}`} className="flex justify-between gap-3 text-sm">
            <span>
              {item.name}
              <span className="text-muted-foreground">
                {" "}
                × {item.qty} ({item.size})
              </span>
            </span>
            <span className="font-semibold">{formatINR(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrackOrderPage() {
  const { id: initialId } = Route.useSearch();
  const [query, setQuery] = useState(initialId ?? "");
  const [result, setResult] = useState<Order | null>(null);
  const [notFoundMsg, setNotFoundMsg] = useState(false);
  const savedOrders = getOrders();

  const track = (rawId: string) => {
    const id = rawId.trim().toUpperCase();
    if (!id) return;
    if (id === DEMO_ORDER_ID) {
      setResult(DEMO_ORDER);
      setNotFoundMsg(false);
      return;
    }
    const found = getOrders().find((o) => o.id.toUpperCase() === id);
    if (found) {
      setResult(found);
      setNotFoundMsg(false);
    } else {
      setResult(null);
      setNotFoundMsg(true);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Where's my merch?
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Track Order</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the Order ID from your confirmation — try the demo ID{" "}
        <span className="font-semibold text-foreground">{DEMO_ORDER_ID}</span>.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          track(query);
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Package className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TI-2026-1042"
            className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Search className="h-4 w-4" /> Track
        </button>
      </form>

      {notFoundMsg && (
        <p className="mt-4 rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          We couldn't find that Order ID. Demo store — try {DEMO_ORDER_ID} or place an
          order first.
        </p>
      )}

      {result && (
        <div className="mt-8">
          <Timeline order={result} />
        </div>
      )}

      {savedOrders.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Truck className="h-4 w-4 text-primary" /> Your recent orders
          </h2>
          <div className="mt-4 space-y-2">
            {savedOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setQuery(o.id);
                  track(o.id);
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-left transition-colors hover:border-primary"
              >
                <span>
                  <span className="font-display font-bold">{o.id}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{o.status}</span>
                </span>
                <span className="text-sm font-semibold">{formatINR(o.total)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 text-center text-xs text-muted-foreground">
        This is a visual demo — orders placed here are saved in your browser only.{" "}
        <Link to="/shop" className="font-semibold text-primary">
          Back to the store
        </Link>
      </p>
    </div>
  );
}
