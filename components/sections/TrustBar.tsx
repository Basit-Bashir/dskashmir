import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Free Shipping",
    sub: "On all orders over ₹10,000",
  },
  {
    icon: ShieldCheck,
    title: "2-Year Warranty",
    sub: "Full manufacturer coverage",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    sub: "Hassle-free returns",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    sub: "24/7 dedicated team",
  },
];

export default function TrustBar() {
  return (
    <div className="border-t border-b border-hp-light bg-white">
      <div className="max-content">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-hp-light">
          {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-4 px-6 py-5 md:px-8 md:py-6"
            >
              <div className="w-9 h-9 rounded-full bg-hp-cream flex items-center
                              justify-center flex-shrink-0">
                <Icon size={16} strokeWidth={1.5} className="text-hp-blue" />
              </div>
              <div>
                <strong className="block text-[12px] font-medium tracking-[0.04em]
                                   text-hp-black">
                  {title}
                </strong>
                <span className="text-[11px] text-hp-gray font-light">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
