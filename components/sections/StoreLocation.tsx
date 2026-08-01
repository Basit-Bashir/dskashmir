import { MapPin, ArrowUpRight } from "lucide-react";

const ADDRESS =
  "Digital Solution Kashmir, Mir Mall, Municipality Road, Opp. DPL, Karan Nagar, Srinagar, Jammu and Kashmir 190010";

export default function StoreLocation() {
  const encodedAddress = encodeURIComponent(ADDRESS);
  const embedSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <section className="section-pad py-14 md:py-16 bg-hp-cream border-t border-hp-light">
      <div className="max-content grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-hp-gray font-semibold mb-3">
            Visit Us
          </p>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-hp-black mb-4">
            Digital Solution Kashmir
          </h2>
          <p className="flex items-start gap-2.5 text-sm text-hp-black/60 leading-relaxed max-w-sm mb-7">
            <MapPin size={17} strokeWidth={1.5} className="text-hp-blue flex-shrink-0 mt-0.5" />
            Mir Mall, Municipality Road, Opp. DPL, Karan Nagar, Srinagar,
            Jammu and Kashmir 190010
          </p>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-outline inline-flex"
          >
            Get Directions <ArrowUpRight size={13} strokeWidth={2} />
          </a>
        </div>

        <div className="rounded-3xl overflow-hidden border border-hp-light aspect-[4/3] md:aspect-[16/11]">
          <iframe
            src={embedSrc}
            title="Digital Solution Kashmir location"
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
