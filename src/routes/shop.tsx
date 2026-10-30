import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category:
      typeof search.category === "string" && search.category ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — Thapar Institute Campus Store" },
      {
        name: "description",
        content:
          "Browse all official Thapar Institute merchandise — apparel, stationery, drinkware and accessories.",
      },
      { property: "og:title", content: "Shop All — Thapar Institute Campus Store" },
      {
        property: "og:description",
        content:
          "Browse all official Thapar Institute merchandise — apparel, stationery, drinkware and accessories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

type SortKey = "featured" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

function ShopPage() {
  const { category } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    let list = PRODUCTS;
    if (category) list = list.filter((p) => p.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            The full catalogue
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Shop All
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the store"
              className="w-56 rounded-full border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            aria-label="Sort products"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => Route.navigate({ search: {} })}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            !category
              ? "bg-foreground text-background"
              : "border border-border bg-card text-foreground hover:border-primary"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => Route.navigate({ search: { category: c } })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              category === c
                ? "bg-foreground text-background"
                : "border border-border bg-card text-foreground hover:border-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-border bg-card p-16 text-center">
          <p className="font-display text-xl font-semibold">Nothing found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or clear the filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
