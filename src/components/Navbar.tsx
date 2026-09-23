import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, User as UserIcon, LayoutDashboard, MapPin, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSalonConfig } from '../context/SalonConfigContext';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const { user, profile, openAuthModal, openDashboard } = useAuth();
  const { config, openEditModal } = useSalonConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['services', 'gallery', 'experience', 'reviews', 'location', 'visit'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Gallery', href: '#gallery', id: 'gallery' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Reviews', href: '#reviews', id: 'reviews' },
    { label: 'Location', href: '#location', id: 'location' },
    { label: 'Visit', href: '#visit', id: 'visit' }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 rounded-2xl px-5 sm:px-6 ${
          scrolled
            ? 'py-2.5 bg-[#090b0e]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
            : 'py-4 bg-transparent border border-transparent'
        }`}
      >
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="text-base sm:text-lg font-extrabold tracking-tight text-white font-display flex items-center gap-1.5 group"
          >
            <span className="tracking-tight">{config.shortName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff32] group-hover:scale-150 transition-transform shadow-[0_0_8px_#d4ff32]" />
            {config.branch && (
              <span className="text-[11px] font-mono font-medium text-slate-400 hidden sm:inline-block ml-1">
                {config.branch}
              </span>
            )}
          </a>
          <button
            onClick={openEditModal}
            className="p-1 rounded-lg text-slate-500 hover:text-[#d4ff32] hover:bg-white/5 transition-colors"
            title="Edit shop name & branding"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors relative py-1 text-xs uppercase tracking-wider font-semibold ${
                  isActive ? 'text-[#d4ff32]' : 'hover:text-white text-slate-300'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d4ff32] rounded-full shadow-[0_0_8px_#d4ff32]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Phone Call */}
          <a
            href={`tel:${config.phoneFormatted}`}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors border border-white/10"
            title={`Call ${config.name}`}
          >
            <Phone className="w-3.5 h-3.5 text-[#d4ff32]" />
            <span>{config.phone}</span>
          </a>

          {/* User Account / Customer Dashboard */}
          {user ? (
            <button
              onClick={openDashboard}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#d4ff32]/20 border border-white/10 hover:border-[#d4ff32]/40 text-xs font-mono text-slate-200 hover:text-white transition-all"
              title="Open Customer Dashboard"
            >
              <div className="w-5 h-5 rounded-full bg-[#d4ff32] text-black font-bold flex items-center justify-center text-[10px]">
                {(profile?.name || user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline font-semibold">
                {(profile?.name || user.displayName || 'Member').split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
              title="Sign In / Register"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#d4ff32]" />
              <span className="hidden sm:inline">SIGN IN</span>
            </button>
          )}

          {/* Book Online Primary Button */}
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#d4ff32] hover:bg-[#bef264] rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(212,255,50,0.3)] hover:shadow-[0_0_25px_rgba(212,255,50,0.5)] active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>BOOK ONLINE</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-[#0d1015]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold tracking-wide text-slate-300 hover:text-black hover:bg-[#d4ff32] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); openDashboard(); }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#d4ff32]/10 border border-[#d4ff32]/30 text-xs font-mono text-[#d4ff32]"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Customer Dashboard ({profile?.name || user.displayName || 'Member'})</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#d4ff32]" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); openEditModal(); }}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-[#d4ff32]"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d4ff32]" />
              <span>Edit Shop Name & Details</span>
            </button>

            <a
              href={`tel:${config.phoneFormatted}`}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs font-mono text-slate-200 border border-white/10"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4ff32]" />
              <span>{config.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

