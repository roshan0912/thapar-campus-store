import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CircleCheck } from "lucide-react";
import { useState } from "react";
import { useCart, saveOrder, type Order } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatINR, getProduct } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Thapar Institute Campus Store" },
      {
        name: "description",
        content: "Complete your Thapar Institute merchandise order.",
      },
      { property: "og:title", content: "Checkout — Thapar Institute Campus Store" },
      {
        property: "og:description",
        content: "Complete your Thapar Institute merchandise order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const STEPS = ["Cart", "Details", "Payment", "Confirmation"] as const;

function Progress({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "border-2 border-primary text-primary"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-[11px] font-semibold sm:text-xs ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`mb-5 h-px flex-1 ${done ? "bg-primary" : "bg-border"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "School of Business",
  "Administration",
];

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState<"details" | "payment" | "done">("details");
  const [order, setOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({
    name: "",
    department: DEPARTMENTS[0] ?? "",
    email: "",
    phone: "",
    purpose: "Personal purchase",
    location: "",
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const detailsValid =
    form.name.trim().length > 1 &&
    /.+@.+\..+/.test(form.email) &&
    form.phone.trim().length >= 10 &&
    form.location.trim().length > 2;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const placed: Order = {
      id,
      items: lines.map((l) => {
        const p = getProduct(l.slug);
        return {
          slug: l.slug,
          name: p?.name ?? l.slug,
          size: l.size,
          qty: l.qty,
          price: p?.price ?? 0,
        };
      }),
      total,
      placedAt: new Date().toISOString(),
      status: "Packed",
    };
    saveOrder(placed);
    setOrder(placed);
    clear();
    setStep("done");
  };

  const stepIndex = step === "details" ? 1 : step === "payment" ? 2 : 3;

  if (step === "done" && order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10">
          <CircleCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">
          Order confirmed
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you, {form.name.split(" ")[0] || "Thaparite"}! Your order is being packed
          at the campus store.
        </p>
        <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Order ID
              </p>
              <p className="font-display text-2xl font-bold tracking-tight">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Total paid
              </p>
              <p className="font-display text-2xl font-bold">{formatINR(order.total)}</p>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-xs text-muted-foreground">
            Save your Order ID — you'll need it on the Track Order page. (This is a
            visual demo; no payment was processed.)
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/track-order"
            search={{ id: order.id }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Track this order <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Nothing to check out
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your cart is empty — add something first.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse the store <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">Checkout</h1>
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <Progress current={stepIndex} />

        <form
          onSubmit={placeOrder}
          className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]"
        >
          <div>
            {step === "details" ? (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-bold">Delivery details</h2>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Full name</span>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Aditi Sharma"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Department</span>
                  <select value={form.department} onChange={set("department")} className={inputClass}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">
                      Institute email
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="asharma@thapar.edu"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Phone</span>
                    <input
                      required
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Delivery location on campus
                  </span>
                  <input
                    required
                    value={form.location}
                    onChange={set("location")}
                    placeholder="Hostel H-4, Room 212"
                    className={inputClass}
                  />
                </label>
                <button
                  type="button"
                  disabled={!detailsValid}
                  onClick={() => setStep("payment")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to details
                </button>
                <h2 className="font-display text-xl font-bold">Payment</h2>
                <p className="rounded-xl bg-muted px-4 py-3 text-xs text-muted-foreground">
                  Demo checkout — use any card details. Nothing is charged.
                </p>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Card number
                  </span>
                  <input
                    required
                    inputMode="numeric"
                    defaultValue="4242 4242 4242 4242"
                    className={inputClass}
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Expiry</span>
                    <input required defaultValue="12/28" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">CVV</span>
                    <input
                      required
                      inputMode="numeric"
                      defaultValue="123"
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Pay {formatINR(total)} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl bg-cream p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                return (
                  <li
                    key={`${l.slug}-${l.size}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate">
                      {p.name}
                      <span className="text-muted-foreground">
                        {" "}
                        × {l.qty} ({l.size})
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold">
                      {formatINR(p.price * l.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? "Free" : formatINR(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="font-display font-bold">Total</dt>
                <dd className="font-display text-xl font-bold">{formatINR(total)}</dd>
              </div>
            </dl>
          </aside>
        </form>
      </div>
    </div>
  );
}
