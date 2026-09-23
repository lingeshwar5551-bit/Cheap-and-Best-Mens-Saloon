import React, { useState } from 'react';
import { ArrowUpRight, Share2, ThumbsUp, MapPin } from 'lucide-react';

export const SocialSection: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 glass-panel-neon border border-[#d4ff32]/30 overflow-hidden">
          
          {/* Ambient Lighting Background */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#d4ff32]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Text & Social Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold">
                <Share2 className="w-3.5 h-3.5" />
                <span>Community & Social Connection</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
                JOIN THE <span className="text-[#d4ff32]">COMMUNITY.</span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Stay updated with modern haircut inspirations, styling masterclasses, festival offers, and real transformation stories directly from Cheap and Best Men's Salon, Mogappair.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Official Facebook URL Button */}
                <a
                  href="https://www.facebook.com/cheapandbestsalon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(212,255,50,0.35)] flex items-center gap-2 active:scale-95 group"
                >
                  <ThumbsUp className="w-4 h-4 fill-black" />
                  <span>VISIT SALON ON FACEBOOK</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 py-2">
                  <MapPin className="w-4 h-4 text-[#d4ff32]" />
                  <span>2, VOC Street Road, Mogappair</span>
                </div>
              </div>
            </div>

            {/* Right: The 5th Supplied Visual Object with 3D Tilt, Glow, Reflection & Hover Animation */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1})`,
                  transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out'
                }}
                className="relative cursor-pointer group"
              >
                {/* 3D Volumetric Glow under the emblem */}
                <div
                  className={`absolute -inset-4 bg-gradient-to-r from-[#d4ff32]/30 via-emerald-400/20 to-[#d4ff32]/30 rounded-3xl blur-2xl transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-60'
                  }`}
                />

                {/* Main Visual Frame */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glass-panel-neon border-2 border-[#d4ff32]/40 shadow-2xl p-2 bg-[#090b0e]">
                  <img
                    src="/src/assets/images/salon_social_visual_1790171524036.jpg"
                    alt="Cheap & Best Men's Salon Mogappair 3D Insignia Emblem"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Metallic Light Sweep Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Corner Accent Badge */}
                  <div className="absolute bottom-4 inset-x-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-white font-bold tracking-wider">CHEAP & BEST</span>
                    <span className="text-[#d4ff32] font-semibold">MOGAPPAIR BRAND</span>
                  </div>
                </div>

                {/* Mirror Floor Reflection */}
                <div className="w-full h-8 bg-gradient-to-b from-[#d4ff32]/10 to-transparent blur-md mt-2 rounded-full transform scale-90" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
