import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";
import logoAsset from "@/assets/thapar-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src={logoAsset.url}
            alt="Thapar Institute of Engineering & Technology"
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The official merchandise store of Thapar Institute of Engineering &amp;
            Technology — designed on campus, made for every Thaparite.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="transition-colors hover:text-primary">
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition-colors hover:text-primary">
                Your Cart
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="transition-colors hover:text-primary">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide">
            Visit Us
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Thapar Institute of Engineering &amp; Technology
            <br />
            Bhadra, Patiala
            <br />
            Punjab 147004, India
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground">
          © 2026 Thapar Institute Campus Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
