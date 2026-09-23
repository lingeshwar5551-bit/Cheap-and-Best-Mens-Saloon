import React from 'react';
import { ArrowUpRight, Star, Clock, MapPin, Sparkles } from 'lucide-react';
import { BarberGame } from './BarberGame';
import { useSalonConfig } from '../context/SalonConfigContext';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { config } = useSalonConfig();
  return (
    <section className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Cinematic Typography & CTAs */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Location & Status unboxed metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-[#d4ff32] font-bold tracking-wider uppercase">
                {config.name}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#d4ff32]" /> {config.branch ? `${config.branch}, Chennai` : 'Chennai'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#d4ff32]" /> Closes 10 PM
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <strong className="text-white">{config.rating}</strong> ({config.reviewsCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Giant Cinematic Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] font-display">
                <span className="block hover:text-[#d4ff32] transition-colors duration-300">STYLE</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">WITHOUT</span>
                <span className="block text-[#d4ff32] neon-text-glow">LIMITS.</span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              “A bold, modern salon experience for haircuts, styling, colour, keratin, grooming and more —
              designed around your look and your budget.”
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-7 py-3.5 rounded-2xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(212,255,50,0.35)] hover:shadow-[0_0_40px_rgba(212,255,50,0.55)] active:scale-95 flex items-center gap-2 group whitespace-nowrap"
              >
                <span>RESERVE A CHAIR</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#services"
                className="px-7 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 border border-white/15 hover:border-[#d4ff32]/50 whitespace-nowrap"
              >
                EXPLORE SERVICES
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">4.9★</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">2,003 Google Reviews</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#d4ff32]">10 PM</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Night Closing Time</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">11+</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Specialized Services</div>
              </div>
            </div>
          </div>

          {/* Right Column: Signature 3D Interactive Barber Game Simulator */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full relative">
              {/* Subtle badge indicator */}
              <div className="absolute -top-3.5 left-6 z-20 px-3 py-1 rounded-full bg-[#d4ff32] text-black text-[11px] font-mono font-extrabold tracking-wider shadow-lg flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Interactive 3D Simulator
              </div>

              {/* The Barber Game Simulator */}
              <BarberGame />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
