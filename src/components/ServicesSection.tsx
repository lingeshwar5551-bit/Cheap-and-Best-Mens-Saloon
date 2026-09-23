import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  Baby, 
  Scissors, 
  Sun, 
  Flame, 
  ShieldCheck, 
  Smile, 
  CalendarCheck, 
  Droplets, 
  Zap,
  ArrowUpRight,
  Heart
} from 'lucide-react';
import { SalonService } from '../types';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite, subscribeToUserFavorites, FavoriteRecord } from '../services/firestore';

const SALON_SERVICES: SalonService[] = [
  {
    number: '01',
    id: 'hair-colouring',
    name: 'Hair Colouring',
    description: 'Rich, ammonia-free shades and gray coverage curated to complement your skin tone with lustrous shine.',
    tag: 'Colour & Tone',
    iconName: 'Palette'
  },
  {
    number: '02',
    id: 'hairstyling',
    name: 'Hairstyling',
    description: 'Precision blow-dry, pomade sculpting, textured crops, and runway-ready finishes for any occasion.',
    tag: 'Signature Styling',
    iconName: 'Sparkles'
  },
  {
    number: '03',
    id: 'childrens-cuts',
    name: "Children's Cuts",
    description: 'Gentle, patient, and modern cuts tailored for kids with zero fuss and maximum style confidence.',
    tag: 'Junior Grooming',
    iconName: 'Baby'
  },
  {
    number: '04',
    id: 'haircut',
    name: 'Haircut',
    description: 'Customized scissor work and clipper fades aligned with your head shape, hair density, and lifestyle.',
    tag: 'Core Essential',
    iconName: 'Scissors'
  },
  {
    number: '05',
    id: 'hair-highlighting',
    name: 'Hair Highlighting',
    description: 'Subtle dimensional sun-kissed streaks and bold contrast highlights tailored for modern men.',
    tag: 'Dimension',
    iconName: 'Sun'
  },
  {
    number: '06',
    id: 'hair-straightening',
    name: 'Hair Straightening',
    description: 'Smooth, manageable hair texture with long-lasting rebonding and smoothening treatments.',
    tag: 'Smoothing',
    iconName: 'Flame'
  },
  {
    number: '07',
    id: 'keratin-treatments',
    name: 'Keratin Treatments',
    description: 'Deep protein infusion restoring hair strength, eliminating frizz, and imparting silky luxury shine.',
    tag: 'Restorative Care',
    iconName: 'ShieldCheck'
  },
  {
    number: '08',
    id: 'make-up-services',
    name: 'Make-up Services',
    description: 'Subtle groom and event touch-ups, beard tinting, skin correction, and camera-ready prep.',
    tag: 'Event Ready',
    iconName: 'Smile'
  },
  {
    number: '09',
    id: 'online-booking',
    name: 'Online Hair Salon Booking',
    description: 'Instant chair reservation without waiting in queues. Pick your date, time slot, and preferred barber.',
    tag: 'Priority Access',
    iconName: 'CalendarCheck'
  },
  {
    number: '10',
    id: 'shampoo-conditioning',
    name: 'Shampoo & Conditioning',
    description: 'Invigorating scalp massage with organic detoxifying shampoos and deep conditioning moisture masks.',
    tag: 'Scalp Therapy',
    iconName: 'Droplets'
  },
  {
    number: '11',
    id: 'shaving',
    name: 'Shaving',
    description: 'Traditional hot towel straight-razor shave, beard sculpting, and soothing antiseptic balm finish.',
    tag: 'Barber Craft',
    iconName: 'Zap'
  }
];

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { user, openAuthModal } = useAuth();
  const [tiltCardId, setTiltCardId] = useState<string | null>(null);
  const [tiltStyle, setTiltStyle] = useState<{ [key: string]: { transform: string } }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!user) {
      setFavorites({});
      return;
    }
    const unsub = subscribeToUserFavorites(user.uid, (favList) => {
      const map: { [key: string]: boolean } = {};
      favList.forEach((f) => {
        map[f.serviceId] = true;
      });
      setFavorites(map);
    });
    return () => unsub();
  }, [user]);

  const handleToggleFavorite = async (e: React.MouseEvent, serviceId: string, serviceName: string) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      await toggleFavorite(user.uid, serviceId, serviceName);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTiltCardId(id);
    setTiltStyle((prev) => ({
      ...prev,
      [id]: {
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
      }
    }));
  };

  const handleMouseLeave = (id: string) => {
    setTiltCardId(null);
    setTiltStyle((prev) => ({
      ...prev,
      [id]: {
        transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)'
      }
    }));
  };

  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-[#d4ff32]" };
    switch (iconName) {
      case 'Palette': return <Palette {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Baby': return <Baby {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'CalendarCheck': return <CalendarCheck {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return <Scissors {...props} />;
    }
  };

  return (
    <section id="services" className="relative py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d4ff32]" />
              <span>Full Barber Menu</span>
              <span aria-hidden="true">·</span>
              <span>11 Core Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
              SERVICES CRAFTED FOR <span className="text-[#d4ff32]">PRECISION.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md">
            Every service blends expert barbering techniques with premium grooming products at honest, transparent rates.
          </p>
        </div>

        {/* 11 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SALON_SERVICES.map((service) => {
            const isTilted = tiltCardId === service.id;
            const customTransform = tiltStyle[service.id]?.transform || 'perspective(800px) rotateX(0deg) rotateY(0deg)';

            return (
              <div
                key={service.id}
                onMouseMove={(e) => handleMouseMove(service.id, e)}
                onMouseLeave={() => handleMouseLeave(service.id)}
                style={{ transform: customTransform, transition: isTilted ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out' }}
                className="group relative rounded-3xl p-7 glass-panel hover:glass-panel-neon transition-all duration-300 border border-white/10 hover:border-[#d4ff32]/40 flex flex-col justify-between"
              >
                {/* Metallic light streak on card hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Bar: Number + Favorite + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-slate-500 group-hover:text-[#d4ff32] transition-colors">
                        {service.number}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(e, service.id, service.name)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          favorites[service.id]
                            ? 'bg-pink-500/20 text-pink-400 border-pink-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                            : 'bg-white/5 text-slate-500 hover:text-white border-white/10'
                        }`}
                        title={favorites[service.id] ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites[service.id] ? 'fill-pink-400' : ''}`} />
                      </button>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.04] group-hover:bg-[#d4ff32]/15 border border-white/10 group-hover:border-[#d4ff32]/40 transition-all duration-300 shadow-sm">
                      {renderIcon(service.iconName)}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-[#d4ff32] transition-colors flex items-center justify-between">
                    <span>{service.name}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action: Book this service */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    {service.tag}
                  </span>
                  <button
                    onClick={() => onSelectService(service.name)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-200 group-hover:text-[#d4ff32] transition-colors"
                  >
                    <span>Book Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
