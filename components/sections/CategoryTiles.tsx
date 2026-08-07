import Link from "next/link";
import { Laptop, Printer } from "lucide-react";

interface CategoryTilesProps {
  laptopImage?: string;
  printerImage?: string;
}

const DEFAULT_LAPTOP_IMG =
  "https://hp.widen.net/content/9iqnhnbc9a/png/9iqnhnbc9a.png?w=1659&h=1246&dpi=72&color=ffffff00";
const DEFAULT_PRINTER_IMG =
  "https://hp.widen.net/content/zspr9jpmoa/png/zspr9jpmoa.png?w=1659&h=1246&dpi=72&color=ffffff00";

export default function CategoryTiles({
  laptopImage,
  printerImage,
}: CategoryTilesProps) {
  const tiles = [
    {
      label: "Laptops",
      sub: "Power for every workflow",
      href: "/collections?category=Laptops",
      bg: "bg-sage",
      Icon: Laptop,
      image: laptopImage || DEFAULT_LAPTOP_IMG,
    },
    {
      label: "Printers",
      sub: "Print, scan and share with ease",
      href: "/collections?category=Printers",
      bg: "bg-sky",
      Icon: Printer,
      image: printerImage || DEFAULT_PRINTER_IMG,
    },
  ];

  return (
    <section className="bg-hp-cream pb-4 md:pb-6">
      <div className="max-content section-pad grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiles.map(({ label, sub, href, bg, Icon, image }) => (
          <Link
            key={label}
            href={href}
            className={`group relative rounded-3xl overflow-hidden ${bg} aspect-[4/3] md:aspect-[16/11]
                       flex items-end p-7 md:p-9 shadow-2xs hover:shadow-md transition-all duration-300`}
          >
            {/* Background SKU Product Image */}
            {image && (
              <div className="absolute right-2 sm:right-4 top-2 bottom-2 w-[55%] md:w-[60%] flex items-center justify-end p-2 md:p-4 pointer-events-none z-0">
                <img
                  src={image}
                  alt={`${label} SKU background`}
                  className="max-h-[85%] max-w-full w-auto object-contain drop-shadow-xl group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500 ease-out select-none"
                />
              </div>
            )}

            {/* Background Accent Icon */}
            <Icon
              size={64}
              strokeWidth={0.75}
              className="absolute top-6 right-6 text-hp-black/10 group-hover:scale-110 transition-transform duration-300 pointer-events-none z-0"
            />

            {/* Foreground Text Content */}
            <div className="relative z-10 max-w-[220px] sm:max-w-[260px]">
              <h3 className="text-xl md:text-2xl font-medium text-hp-black mb-1">
                {label}
              </h3>
              <p className="text-sm text-hp-black/65 mb-4 leading-relaxed">
                {sub}
              </p>
              <span className="btn-pill inline-flex">Shop {label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
