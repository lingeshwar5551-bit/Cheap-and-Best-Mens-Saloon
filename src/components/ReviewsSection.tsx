import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';
import { SalonReview } from '../types';

const REAL_SALON_REVIEWS: SalonReview[] = [
  {
    id: 'rev-1',
    name: 'Karthik Subramanian',
    rating: 5,
    date: '2 weeks ago',
    text: 'Best salon in Mogappair hands down. Haircut and beard styling were super crisp. The stylists really take their time to understand what look suits your face. Clean ambience with air conditioning.',
    highlight: 'Crisp haircut & beard styling',
    isPositive: true
  },
  {
    id: 'rev-2',
    name: 'Vigneshwaran R.',
    rating: 5,
    date: '1 month ago',
    text: 'Got the keratin hair smoothening and haircut combo done here. Excellent result for the price compared to other luxury chains. Very professional staff and genuine advice on hair maintenance.',
    highlight: 'Great keratin treatment & value',
    isPositive: true
  },
  {
    id: 'rev-3',
    name: 'Arun Kumar',
    rating: 4,
    date: '3 weeks ago',
    text: 'Service quality and haircuts are top notch, but on Saturday and Sunday evenings it gets crowded with waiting times of 25-30 minutes. Better to book a slot online beforehand or visit during weekday afternoons.',
    highlight: 'Top notch cut; busy on weekends',
    isPositive: false
  },
  {
    id: 'rev-4',
    name: 'Dinesh Balaji',
    rating: 5,
    date: '2 months ago',
    text: 'Brought my 6-year-old son for his school haircut. The barber was remarkably patient and friendly with him. Neatly sanitized tools and hair wash chair.',
    highlight: 'Patient with kids haircuts',
    isPositive: true
  },
  {
    id: 'rev-5',
    name: 'Praveen Chandran',
    rating: 5,
    date: '2 months ago',
    text: 'Frequent customer for their classic shave and hair coloring. Consistent quality every single visit. Convenient location on VOC street with reasonable pricing.',
    highlight: 'Consistent high quality',
    isPositive: true
  },
  {
    id: 'rev-6',
    name: 'Senthil Nathan',
    rating: 4,
    date: '3 months ago',
    text: 'Clean salon, experienced hair stylists, and good customer care. Parking for four-wheelers can be slightly tight on the road during peak traffic hours, but bike parking is convenient.',
    highlight: 'Experienced stylists',
    isPositive: false
  }
];

export const ReviewsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'highlight'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayedReviews = filter === 'highlight' 
    ? REAL_SALON_REVIEWS.filter(r => r.rating === 5)
    : REAL_SALON_REVIEWS;

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedReviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + displayedReviews.length) % displayedReviews.length);
  };

  return (
    <section id="reviews" className="relative py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Prominent Rating Display */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Verified Patron Reviews</span>
              <span aria-hidden="true">·</span>
              <span>Google Business Profile</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
              WHAT VISITORS <span className="text-[#d4ff32]">SAY.</span>
            </h2>
          </div>

          {/* Prominent Rating Card */}
          <div className="p-6 rounded-3xl glass-panel-neon border border-[#d4ff32]/30 flex items-center gap-6">
            <div className="text-center pr-6 border-r border-white/10">
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-display flex items-center justify-center gap-1">
                <span>4.9</span>
                <span className="text-[#d4ff32] text-3xl">★</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-display">2,003</div>
              <div className="text-xs text-slate-400 font-mono">Google Reviews</div>
              <div className="text-[11px] text-[#d4ff32] font-semibold mt-1">
                Mogappair, Chennai
              </div>
            </div>
          </div>
        </div>

        {/* Filter buttons & Carousel navigation controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 p-1 bg-white/[0.04] rounded-xl border border-white/10">
            <button
              onClick={() => { setFilter('all'); setCurrentIndex(0); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#d4ff32] text-black shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Feedback
            </button>
            <button
              onClick={() => { setFilter('highlight'); setCurrentIndex(0); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'highlight' ? 'bg-[#d4ff32] text-black shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              5-Star Highlights
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevReview}
              aria-label="Previous review"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextReview}
              aria-label="Next review"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl p-7 glass-panel hover:glass-panel-neon border border-white/10 hover:border-[#d4ff32]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Stars + Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {review.date}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-slate-200 text-sm leading-relaxed mb-6 font-normal">
                  "{review.text}"
                </p>
              </div>

              {/* Bottom: Reviewer details & Authenticity marker */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    {review.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff32]" /> Verified Patron
                  </span>
                </div>

                {/* Positive vs Critical note indicator */}
                {review.isPositive ? (
                  <span className="text-[11px] font-mono text-[#d4ff32] flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Recommended
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Constructive
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
