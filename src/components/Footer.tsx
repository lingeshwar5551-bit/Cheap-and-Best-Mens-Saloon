import React from 'react';
import { Phone, MapPin, Clock, Star, ThumbsUp, ArrowUp, Edit3 } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  const { config, openEditModal } = useSalonConfig();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060709] border-t border-white/10 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <a href="#" className="text-2xl font-extrabold text-white font-display flex items-center gap-1.5">
                <span>{config.shortName}</span>
                <span className="w-2 h-2 rounded-full bg-[#d4ff32]" />
              </a>
              <button
                onClick={openEditModal}
                className="p-1 rounded-lg text-slate-500 hover:text-[#d4ff32] hover:bg-white/5 transition-colors"
                title="Edit shop name & branding"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs font-mono text-[#d4ff32] uppercase font-bold tracking-wider">
              {config.name}{config.branch ? `, ${config.branch}` : ''}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              A bold, modern salon experience for haircuts, styling, colour, keratin, grooming and more — designed around your look and your budget.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {config.rating} Rating
              </span>
              <span>·</span>
              <span>{config.reviewsCount.toLocaleString()} Google Reviews</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="hover:text-[#d4ff32] transition-colors">Services</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#d4ff32] transition-colors">Gallery</a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#d4ff32] transition-colors">Experience</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#d4ff32] transition-colors">Reviews</a>
              </li>
              <li>
                <a href="#visit" className="hover:text-[#d4ff32] transition-colors">Location</a>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Signature Services
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Haircut & Precision Fade</li>
              <li>Keratin Smooth Treatments</li>
              <li>Hair Colouring & Highlights</li>
              <li>Classic Hot-Towel Shave</li>
              <li>Children's Styling & Cuts</li>
              <li>Scalp Conditioning Therapy</li>
            </ul>
          </div>

          {/* Location & Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Visit Studio
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              {config.address}
            </p>
            <div className="text-xs font-mono space-y-1">
              <div className="text-white">
                Phone:{' '}
                <a href={`tel:${config.phoneFormatted}`} className="text-[#d4ff32] hover:underline font-bold">
                  {config.phone}
                </a>
              </div>
              <div className="text-slate-400">Open Daily · Closes 10 PM</div>
            </div>
            <div className="pt-2">
              <a
                href="https://www.facebook.com/cheapandbestsalon/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-[#d4ff32] transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#d4ff32]" /> Follow on Facebook
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} {config.name.toUpperCase()}{config.branch ? `, ${config.branch.toUpperCase()}` : ''}. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenBooking}
              className="text-[#d4ff32] hover:underline uppercase font-bold"
            >
              BOOK ONLINE
            </button>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>TOP</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
