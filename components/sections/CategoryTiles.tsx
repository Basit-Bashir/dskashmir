import Link from "next/link";
import { Laptop, Printer } from "lucide-react";

const TILES = [
  {
    label: "Laptops",
    sub: "Power for every workflow",
    href: "/collections",
    bg: "bg-sage",
    Icon: Laptop,
  },
  {
    label: "Printers",
    sub: "Print, scan and share with ease",
    href: "/collections",
    bg: "bg-sky",
    Icon: Printer,
  },
];

export default function CategoryTiles() {
  return (
    <section className="bg-hp-cream pb-4 md:pb-6">
      <div className="max-content section-pad grid grid-cols-1 md:grid-cols-2 gap-4">
        {TILES.map(({ label, sub, href, bg, Icon }) => (
          <Link
            key={label}
            href={href}
            className={`group relative rounded-3xl overflow-hidden ${bg} aspect-[4/3] md:aspect-[16/11]
                       flex items-end p-7 md:p-9`}
          >
            <Icon
              size={72}
              strokeWidth={0.75}
              className="absolute top-7 right-7 text-hp-black/15 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-medium text-hp-black mb-1">{label}</h3>
              <p className="text-sm text-hp-black/55 mb-4 max-w-[220px]">{sub}</p>
              <span className="btn-pill inline-flex">Shop {label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
