import mugImg from "@/assets/products/mug.png";
import hoodieImg from "@/assets/products/hoodie.png";
import teeImg from "@/assets/products/tee.png";
import notebookImg from "@/assets/products/notebook.png";
import bottleImg from "@/assets/products/bottle.png";
import capImg from "@/assets/products/cap.png";
import toteImg from "@/assets/products/tote.png";
import pensetImg from "@/assets/products/penset.png";
import stickersImg from "@/assets/products/stickers.png";
import lanyardImg from "@/assets/products/lanyard.png";

export type Category = "Apparel" | "Stationery" | "Drinkware" | "Accessories";

export const CATEGORIES: Category[] = [
  "Apparel",
  "Stationery",
  "Drinkware",
  "Accessories",
];

export type Badge = "New" | "Bestseller" | "Gifting" | "Limited";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  mrp?: number;
  image: string;
  blurb: string;
  description: string;
  details: string[];
  sizes?: string[];
  rating: number;
  reviews: number;
  badge?: Badge;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "crest-mug",
    name: "Crest Mug",
    category: "Drinkware",
    price: 449,
    mrp: 549,
    image: mugImg,
    blurb: "Glossy ceramic with a crimson glaze inside.",
    description:
      "The morning-lecture classic. A heavy, glossy 350 ml ceramic mug with a crimson-glazed interior and the ti monogram fired onto the body — built for endless cups of chai between labs.",
    details: ["350 ml ceramic", "Dishwasher safe", "Crimson glaze interior"],
    rating: 4.8,
    reviews: 214,
    badge: "Bestseller",
    featured: true,
  },
  {
    slug: "monogram-hoodie",
    name: "Monogram Hoodie",
    category: "Apparel",
    price: 1499,
    mrp: 1799,
    image: hoodieImg,
    blurb: "Heavyweight fleece with crimson drawcords.",
    description:
      "A 380 GSM brushed-fleece hoodie in charcoal with crimson drawcords and an embroidered chest monogram. Warm enough for Patiala winters, sharp enough for the library.",
    details: ["380 GSM brushed fleece", "Embroidered monogram", "Unisex fit"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9,
    reviews: 178,
    badge: "New",
    featured: true,
  },
  {
    slug: "institute-tee",
    name: "Institute Tee",
    category: "Apparel",
    price: 799,
    image: teeImg,
    blurb: "Combed cotton, monogram at the chest.",
    description:
      "A 220 GSM combed-cotton tee with a small crimson monogram at the chest. Pre-shrunk, breathable and cut for campus days that start at 8 AM.",
    details: ["220 GSM combed cotton", "Pre-shrunk", "Regular fit"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviews: 156,
    featured: true,
  },
  {
    slug: "premium-notebook",
    name: "Premium Notebook",
    category: "Stationery",
    price: 349,
    image: notebookImg,
    blurb: "Hardbound, embossed, 192 ruled pages.",
    description:
      "A hardbound A5 notebook in deep crimson with an embossed monogram and elastic closure. 192 pages of thick, bleed-resistant ruled paper — for problem sets worth keeping.",
    details: ["A5 hardbound", "192 ruled pages", "Elastic closure"],
    rating: 4.7,
    reviews: 132,
    featured: true,
  },
  {
    slug: "thermal-bottle",
    name: "Thermal Bottle",
    category: "Drinkware",
    price: 899,
    mrp: 1099,
    image: bottleImg,
    blurb: "Keeps drinks hot 12 h, cold 24 h.",
    description:
      "A 750 ml double-wall vacuum bottle in matte crimson. Hot chai at the 9 AM lecture, cold water through the afternoon lab — and no sweat rings on your notes.",
    details: ["750 ml", "Hot 12 h / cold 24 h", "Food-grade steel"],
    rating: 4.8,
    reviews: 189,
    badge: "New",
  },
  {
    slug: "campus-cap",
    name: "Campus Cap",
    category: "Accessories",
    price: 499,
    image: capImg,
    blurb: "Six-panel cotton cap, tonal embroidery.",
    description:
      "A six-panel brushed-cotton cap in crimson with a crisp white embroidered monogram. Adjustable strap, curved brim, all-day comfort.",
    details: ["Brushed cotton twill", "Adjustable strap", "Embroidered front"],
    rating: 4.5,
    reviews: 96,
  },
  {
    slug: "heritage-tote",
    name: "Heritage Tote",
    category: "Accessories",
    price: 399,
    image: toteImg,
    blurb: "Natural canvas, carries a full library day.",
    description:
      "A sturdy 12 oz natural-canvas tote with reinforced stitching and the crimson monogram screen-printed by hand. Fits a laptop, two files and last-minute readings.",
    details: ["12 oz canvas", "Reinforced handles", "Hand-printed"],
    rating: 4.7,
    reviews: 118,
  },
  {
    slug: "pen-keychain-set",
    name: "Pen & Keychain Set",
    category: "Stationery",
    price: 599,
    mrp: 749,
    image: pensetImg,
    blurb: "Matte black pen with a crimson-trimmed key tag.",
    description:
      "A gift-boxed pair: a matte-black metal pen with crimson trim, plus a hexagonal enamel key tag bearing the monogram. The graduation gift that never misses.",
    details: ["Gift boxed", "Metal ballpoint", "Enamel key tag"],
    rating: 4.9,
    reviews: 87,
    badge: "Gifting",
    featured: true,
  },
  {
    slug: "sticker-sheet",
    name: "Sticker Sheet",
    category: "Stationery",
    price: 199,
    image: stickersImg,
    blurb: "Six vinyl decals for laptops and bottles.",
    description:
      "Six die-cut vinyl stickers in crimson and white — laptop-tested, bottle-proof and weather-resistant. Decorate your setup in official colours.",
    details: ["6 die-cut stickers", "Weatherproof vinyl", "Matte finish"],
    rating: 4.4,
    reviews: 73,
  },
  {
    slug: "id-lanyard",
    name: "ID Lanyard",
    category: "Accessories",
    price: 249,
    image: lanyardImg,
    blurb: "Woven crimson strap with a card holder.",
    description:
      "A tightly woven crimson lanyard with a metal swivel hook and a clear ID card holder. The everyday carry of every Thaparite, done properly.",
    details: ["Woven strap", "Metal swivel hook", "ID holder included"],
    rating: 4.6,
    reviews: 64,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;
