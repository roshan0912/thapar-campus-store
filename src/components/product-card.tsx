import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR, type Product } from "@/lib/products";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? "fill-primary text-primary" : "text-border"
          }`}
        />
      ))}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const size = product.sizes?.[0] ?? "One size";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary-foreground">
              {product.badge}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-1 font-display text-base font-semibold tracking-tight transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="font-display text-lg font-bold">
            {formatINR(product.price)}
            {product.mrp && (
              <span className="ml-2 text-xs font-medium text-muted-foreground line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </p>
          <button
            onClick={() => add(product.slug, size)}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-colors hover:bg-primary"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
