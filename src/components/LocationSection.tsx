import React from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink, ShieldCheck, Car, Wifi, Sparkles } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export const LocationSection: React.FC = () => {
  const { config } = useSalonConfig();
  const salonAddress = config.address;
  const salonPhone = config.phone;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${config.name} ${config.branch} ${config.address}`
  )}`;

  return (
    <section id="location" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4ff32]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff32]/10 border border-[#d4ff32]/30 text-xs font-mono font-bold text-[#d4ff32] tracking-wider uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>LOCATION & DIRECTIONS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
          VISIT {config.shortName}
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Conveniently located on VOC Street in {config.branch || 'Chennai'}. Step in for premium men's grooming in a climate-controlled, ultra-hygienic setting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4ff32]/10 border border-[#d4ff32]/30 flex items-center justify-center text-[#d4ff32] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#d4ff32] uppercase tracking-wider">
                  Salon Address
                </span>
                <p className="text-white text-base sm:text-lg font-semibold leading-relaxed">
                  {config.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Salon Desk Phone
                </span>
                <p className="text-white text-base sm:text-lg font-semibold font-mono">
                  <a href={`tel:${salonPhone.replace(/\s+/g, '')}`} className="hover:text-[#d4ff32] transition-colors">
                    {salonPhone}
                  </a>
                </p>
                <div className="text-xs text-slate-400">Direct booking & inquiries</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Operating Hours
                </span>
                <p className="text-white text-base font-semibold">
                  Open Daily · 9:00 AM – 10:00 PM
                </p>
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open Now · Walk-ins Welcome</span>
                </div>
              </div>
            </div>

            {/* Amenities Pills */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#d4ff32]" />
                <span>Bike & Car Parking</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#d4ff32]" />
                <span>Complimentary Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4ff32]" />
                <span>Sterilized Blades</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4ff32]" />
                <span>Full Air Conditioned</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(212,255,50,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 stroke-[2.5]" />
              <span>[ OPEN MAP ]</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Map Visual / Embedded Map Column */}
        <div className="lg:col-span-7 rounded-3xl bg-black/50 border border-white/10 overflow-hidden shadow-2xl min-h-[380px] relative group">
          {/* Custom Dark Themed Embedded Map */}
          <iframe
            title="Cheap and Best Men's Salon Mogappair Map"
            src="https://maps.google.com/maps?q=13.0838,80.1748+(Cheap+and+Best+Men's+Salon+Mogappair)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
            className="w-full h-full min-h-[420px] border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[1.1] grayscale-[0.2] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            loading="lazy"
            allowFullScreen
          />

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 p-3 rounded-2xl bg-[#0d1015]/90 border border-white/10 backdrop-blur-md text-xs space-y-1 pointer-events-none">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-[#d4ff32]" />
              <span>{config.name}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {config.branch ? `${config.branch}, Chennai` : config.address}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
