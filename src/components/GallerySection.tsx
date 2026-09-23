import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  caption: string;
  imageSrc: string;
  aspect: string;
}

export const GallerySection: React.FC = () => {
  const { config } = useSalonConfig();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const SALON_GALLERY: GalleryItem[] = [
    {
      id: 1,
      title: `${config.name} Storefront & Entrance`,
      category: 'Storefront Entrance',
      caption: `The signature modern dark facade with glowing neon signage and glass welcoming entrance of ${config.name} on VOC Street, ${config.branch || 'Mogappair'}.`,
      imageSrc: '/src/assets/images/salon_storefront_entrance_1790175236935.jpg',
      aspect: 'aspect-video'
    },
    {
      id: 2,
      title: 'Salon Interior & Barber Stations',
      category: 'Interior Studio',
      caption: 'Luxury leather barber chairs, customized vanity mirror illumination, and streamlined charcoal aesthetic.',
      imageSrc: '/src/assets/images/salon_interior_1790171480870.jpg',
      aspect: 'aspect-video'
    },
    {
      id: 3,
      title: 'Service & Pricing Menu Showcase',
      category: 'Grooming Menu',
      caption: 'Official salon service pricing and package highlights crafted for transparent, accessible grooming.',
      imageSrc: '/src/assets/images/salon_service_pricing_poster_1790171495336.jpg',
      aspect: 'aspect-[4/3]'
    },
    {
      id: 4,
      title: 'Street-View & Night Ambience',
      category: 'Exterior Perspective',
      caption: `Evening perspective of the salon situated prominently on 2, VOC Street Road in ${config.branch || 'Mogappair'}, Chennai.`,
      imageSrc: '/src/assets/images/salon_street_view_1790175252270.jpg',
      aspect: 'aspect-video'
    }
  ];

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % SALON_GALLERY.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + SALON_GALLERY.length) % SALON_GALLERY.length);
    }
  };

  return (
    <section id="gallery" className="relative py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d4ff32]" />
              <span>Real Salon Media</span>
              <span aria-hidden="true">·</span>
              <span>Mogappair Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
              AUTHENTIC <span className="text-[#d4ff32]">SPACE & CRAFT.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md">
            Take a visual tour through our Mogappair facility: from the exterior entrance to our state-of-the-art styling chairs.
          </p>
        </div>

        {/* Masonry / Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SALON_GALLERY.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#d4ff32]/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_35px_rgba(212,255,50,0.12)]"
            >
              <div className="relative overflow-hidden w-full bg-[#0c0e12]">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Hover Quick Action Badge */}
                <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <Maximize2 className="w-4 h-4 text-[#d4ff32]" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#d4ff32] font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-1.5 flex items-center gap-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] w-full rounded-3xl overflow-hidden glass-panel-neon border border-[#d4ff32]/30 flex flex-col"
          >
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={SALON_GALLERY[activeImageIndex].imageSrc}
                alt={SALON_GALLERY[activeImageIndex].title}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="p-6 bg-[#0f1217] border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#d4ff32] uppercase">
                  {SALON_GALLERY[activeImageIndex].category} · {activeImageIndex + 1} of {SALON_GALLERY.length}
                </span>
              </div>
              <h4 className="text-xl font-bold font-display text-white mb-1">
                {SALON_GALLERY[activeImageIndex].title}
              </h4>
              <p className="text-sm text-slate-300">
                {SALON_GALLERY[activeImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
