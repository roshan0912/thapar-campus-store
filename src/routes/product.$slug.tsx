import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { ProductCard, Stars } from "@/components/product-card";
import { useCart } from "@/lib/cart";
import { formatINR, getProduct, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} — Thapar Institute Campus Store`
          : "Product — Thapar Institute Campus Store",
      },
      {
        name: "description",
        content: loaderData?.blurb ?? "Official Thapar Institute merchandise.",
      },
      {
        property: "og:title",
        content: loaderData
          ? `${loaderData.name} — Thapar Institute Campus Store`
          : "Product — Thapar Institute Campus Store",
      },
      {
        property: "og:description",
        content: loaderData?.blurb ?? "Official Thapar Institute merchandise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="font-display text-2xl font-bold">Something went wrong</p>
      <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-primary">
        Back to shop
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="font-display text-2xl font-bold">Product not found</p>
      <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-primary">
        Back to shop
      </Link>
    </div>
  ),
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes?.[0] ?? "One size");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, 3);
  const fallbackRelated = PRODUCTS.filter(
    (p) => p.slug !== product.slug && !related.includes(p),
  ).slice(0, 3 - related.length);

  const handleAdd = () => {
    add(product.slug, size, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/shop" className="transition-colors hover:text-primary">
          Shop
        </Link>
        <span>/</span>
        <span>{product.category}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-cream">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-bold tracking-wide text-primary-foreground">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <Stars rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>
          <p className="mt-4 font-display text-3xl font-bold">
            {formatINR(product.price)}
            {product.mrp && (
              <span className="ml-3 text-base font-medium text-muted-foreground line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </p>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.sizes && (
            <div className="mt-7">
              <p className="text-sm font-semibold">Size</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border bg-card">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-display font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label="Increase quantity"
                className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold text-primary-foreground transition-colors sm:flex-none ${
                added ? "bg-foreground" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to cart
                </>
              ) : (
                `Add to cart · ${formatINR(product.price * qty)}`
              )}
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <Truck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs leading-snug text-muted-foreground">
                Free shipping over ₹999 · ships in 2–4 days
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs leading-snug text-muted-foreground">
                7-day easy returns on all products
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-cream p-6">
            <p className="text-sm font-semibold">Details</p>
            <ul className="mt-3 space-y-2">
              {product.details.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {(related.length > 0 || fallbackRelated.length > 0) && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            You may also like
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...related, ...fallbackRelated].map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
