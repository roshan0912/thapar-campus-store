import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import logoAsset from "@/assets/thapar-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
  { to: "/track-order", label: "Track Order" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-xs font-medium tracking-wide">
          Free shipping on orders over ₹999 · Official Thapar Institute merchandise
        </p>
      </div>
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Thapar Institute of Engineering & Technology"
              className="h-11 w-auto rounded-md"
            />
            <span className="hidden min-w-0 flex-col leading-tight lg:flex">
              <span className="truncate font-display text-sm font-semibold tracking-tight">
                Campus Store
              </span>
              <span className="text-xs text-muted-foreground">
                Official Merchandise
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-semibold transition-colors hover:text-primary ${
                  pathname === item.to ? "text-primary" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              to="/shop"
              aria-label="Search the store"
              className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link
              to="/cart"
              aria-label="Open cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
