import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-flatlay.png";
import hoodieImg from "@/assets/products/hoodie.png";
import notebookImg from "@/assets/products/notebook.png";
import bottleImg from "@/assets/products/bottle.png";
import capImg from "@/assets/products/cap.png";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS, type Category } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Thapar Institute Campus Store — Official Merchandise",
      },
      {
        name: "description",
        content:
          "Shop official Thapar Institute merchandise — hoodies, tees, mugs, notebooks and gifts designed for every Thaparite.",
      },
      { property: "og:title", content: "Thapar Institute Campus Store" },
      {
        property: "og:description",
        content:
          "Official merchandise of Thapar Institute of Engineering & Technology — apparel, stationery, drinkware and gifts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORY_TILES: { category: Category; image: string; line: string }[] = [
  { category: "Apparel", image: hoodieImg, line: "Hoodies & tees" },
  { category: "Stationery", image: notebookImg, line: "Notebooks & pens" },
  { category: "Drinkware", image: bottleImg, line: "Mugs & bottles" },
  { category: "Accessories", image: capImg, line: "Caps & totes" },
];

const MARQUEE = [
  "Free shipping over ₹999",
  "New drops every month",
  "Gift wrapping on request",
  "Designed on campus, Patiala",
];

function Index() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      {/* Bento: hero + collection photo */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-rise flex flex-col justify-between rounded-3xl bg-primary p-8 text-primary-foreground sm:col-span-2 lg:row-span-2 lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
              Est. 1956 · Official Merchandise
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Wear the institute.
              <br />
              Carry the legacy.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              The official Thapar collection — heavyweight hoodies, glossy mugs and
              stationery worth keeping, designed on campus for every Thaparite.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-foreground transition-transform hover:scale-[1.03]"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/track-order"
              className="rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
            >
              Track your order
            </Link>
          </div>
        </div>

        <div className="animate-rise relative min-h-64 overflow-hidden rounded-3xl sm:col-span-2 lg:row-span-2" style={{ animationDelay: "80ms" }}>
          <img
            src={heroImg}
            alt="The 2026 Thapar campus collection"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-bold tracking-wide text-foreground backdrop-blur">
            The 2026 Campus Collection
          </span>
        </div>
      </section>

      {/* Bento: category tiles */}
      <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORY_TILES.map((tile, i) => (
          <Link
            key={tile.category}
            to="/shop"
            search={{ category: tile.category }}
            className="animate-rise group relative block h-44 overflow-hidden rounded-3xl sm:h-56"
            style={{ animationDelay: `${140 + i * 60}ms` }}
          >
            <img
              src={tile.image}
              alt={tile.category}
              width={1024}
              height={1024}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-display text-lg font-bold text-background">
                {tile.category}
              </p>
              <p className="text-xs text-background/80">{tile.line}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Marquee band */}
      <section className="mt-10 overflow-hidden rounded-3xl bg-foreground py-3.5 text-background">
        <div className="flex w-max animate-marquee gap-10">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10">
              {MARQUEE.map((item) => (
                <span
                  key={`${dup}-${item}`}
                  className="flex items-center gap-2.5 text-sm font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Best of the store
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              This month's picks
            </h2>
          </div>
          <Link
            to="/shop"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Bento: quote, stats, gifting CTA */}
      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-rise rounded-3xl bg-cream p-8 sm:col-span-2">
          <p className="font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
            "The hoodie survives every winter night in the library. The mug survived
            four years of deadlines."
          </p>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Final-year student, Computer Engineering
          </p>
        </div>
        <div className="animate-rise flex flex-col justify-center gap-5 rounded-3xl border border-border bg-card p-8" style={{ animationDelay: "60ms" }}>
          {[
            ["12,000+", "items delivered to campus"],
            ["4.8 / 5", "average product rating"],
            ["70 yrs", "of institute heritage"],
          ].map(([stat, label]) => (
            <div key={stat}>
              <p className="font-display text-2xl font-bold text-primary">{stat}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <Link
          to="/shop"
          search={{ category: "Stationery" }}
          className="animate-rise group flex flex-col justify-between rounded-3xl bg-primary p-8 text-primary-foreground transition-transform hover:scale-[1.02]"
          style={{ animationDelay: "120ms" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
            Gifting season
          </p>
          <div>
            <p className="font-display text-2xl font-bold leading-tight">
              Gift sets that never miss
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
              Explore gifting
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
