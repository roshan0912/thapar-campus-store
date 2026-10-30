import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatINR, getProduct } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Thapar Institute Campus Store" },
      {
        name: "description",
        content: "Review your Thapar Institute merchandise before checkout.",
      },
      { property: "og:title", content: "Your Cart — Thapar Institute Campus Store" },
      {
        property: "og:description",
        content: "Review your Thapar Institute merchandise before checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill it with something worth carrying around campus.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">Your Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-border rounded-3xl border border-border bg-card">
          {lines.map((line) => {
            const product = getProduct(line.slug);
            if (!product) return null;
            return (
              <div
                key={`${line.slug}-${line.size}`}
                className="flex items-center gap-4 p-4 sm:gap-5"
              >
                <Link
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="shrink-0 overflow-hidden rounded-2xl bg-cream"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="block truncate font-display font-semibold transition-colors hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {product.category} · {line.size}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{formatINR(product.price)}</p>
                </div>
                <div className="flex shrink-0 items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                    aria-label="Decrease quantity"
                    className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold">{line.qty}</span>
                  <button
                    onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                    aria-label="Increase quantity"
                    className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="hidden w-24 shrink-0 text-right font-display font-bold sm:block">
                  {formatINR(product.price * line.qty)}
                </p>
                <button
                  onClick={() => remove(line.slug, line.size)}
                  aria-label={`Remove ${product.name}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">Order Summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
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
            {shipping > 0 && (
              <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-display font-bold">Total</dt>
              <dd className="font-display text-xl font-bold">{formatINR(total)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/shop"
            className="mt-3 flex items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
