import React from 'react';
import { Calendar, Phone, MapPin, Clock, ArrowUpRight, Navigation } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

interface BookingSectionProps {
  onOpenBooking: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onOpenBooking }) => {
  const { config } = useSalonConfig();
  return (
    <section id="visit" className="relative py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Booking Container */}
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 glass-panel-neon border border-[#d4ff32]/40 overflow-hidden bg-gradient-to-br from-[#0e1218] via-[#090b0e] to-[#07090b]">
          
          {/* Volumetric background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4ff32]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Call to Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Priority Chair Reservation</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-tight">
                BOOK THE <span className="text-[#d4ff32] neon-text-glow">CHAIR.</span>
              </h2>

              <p className="text-xl sm:text-2xl text-slate-200 font-light max-w-xl">
                “Your next look starts here.”
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onOpenBooking}
                  className="px-8 py-4 rounded-2xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_35px_rgba(212,255,50,0.4)] hover:shadow-[0_0_45px_rgba(212,255,50,0.6)] active:scale-95 flex items-center gap-2 group"
                >
                  <span>OPEN BOOKING</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <a
                  href={`tel:${config.phoneFormatted}`}
                  className="px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 border border-white/15 hover:border-[#d4ff32]/50 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#d4ff32]" />
                  <span>{config.phone}</span>
                </a>
              </div>
            </div>

            {/* Right: Studio Location & Hours Spec Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-6 sm:p-8 bg-black/60 border border-white/10 space-y-6">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#d4ff32] mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Salon Location
                    </h3>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      <strong className="text-[#d4ff32] font-display uppercase">{config.name}</strong><br />
                      {config.address}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${config.name} ${config.branch} ${config.address}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#d4ff32] hover:underline mt-2"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Get Directions on Maps
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#d4ff32] mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Contact Desk
                    </h3>
                    <a
                      href="tel:07305953594"
                      className="text-base font-bold text-white hover:text-[#d4ff32] transition-colors font-mono"
                    >
                      073059 53594
                    </a>
                    <div className="text-xs text-slate-400 mt-0.5">Appointments & Walk-in Inquiries</div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#d4ff32] mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Operating Schedule
                    </h3>
                    <div className="text-sm font-bold text-white">Open Daily</div>
                    <div className="text-xs text-[#d4ff32] font-mono mt-0.5 font-semibold">
                      Closing time: 10 PM
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
