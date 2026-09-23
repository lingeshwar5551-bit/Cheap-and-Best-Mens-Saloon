import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Sparkles } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const DURATION = 24; // 24 seconds cinematic virtual tour duration

  // Handle play / pause loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now() - (currentTime * 1000);

      const loop = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        const currentProgress = (elapsed % DURATION) / DURATION;
        setProgress(currentProgress * 100);
        setCurrentTime(Math.floor(elapsed % DURATION));

        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    setCurrentTime(Math.floor((val / 100) * DURATION));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <section id="experience" className="relative py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d4ff32]" />
              <span>Cinematic Experience</span>
              <span aria-hidden="true">·</span>
              <span>Virtual Salon Walkthrough</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
              SEE THE PLACE <span className="text-[#d4ff32]">IN MOTION.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md">
            Experience the vibrant atmosphere, ambient neon glow, and high-performance grooming stations inside our Mogappair studio.
          </p>
        </div>

        {/* Video Player Frame */}
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl overflow-hidden glass-panel-neon border border-white/10 group shadow-2xl bg-black"
        >
          {/* Visual Display with cinematic zoom / pan when playing */}
          <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[540px] overflow-hidden flex items-center justify-center">
            <img
              src="/src/assets/images/salon_interior_1790171480870.jpg"
              alt="Cheap and Best Salon Interior Walkthrough"
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${
                isPlaying ? 'scale-115 translate-x-4 -translate-y-2' : 'scale-100'
              }`}
            />

            {/* Cinematic Scrim & Light Streaks */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

            {/* Glowing neon ambient overlay pulse when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-[#d4ff32]/[0.04] pointer-events-none animate-pulse" />
            )}

            {/* Large Center Play / Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className={`p-6 sm:p-7 rounded-full bg-[#d4ff32] text-black shadow-[0_0_40px_rgba(212,255,50,0.5)] transition-all duration-300 z-20 hover:scale-110 active:scale-95 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
              ) : (
                <Play className="w-8 h-8 fill-black translate-x-0.5" />
              )}
            </button>

            {/* Live Camera Badge */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono text-white">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
              <span>{isPlaying ? 'MOGAPPAIR 4K CINEMATIC' : 'SALON PREVIEW'}</span>
            </div>

            {/* Location Tag */}
            <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono text-[#d4ff32]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VOC STREET ROAD</span>
            </div>
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
            {/* Progress Scrubber */}
            <div className="w-full mb-3 flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                aria-label="Video timeline scrubber"
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#d4ff32]"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="hover:text-white transition-colors flex items-center gap-1.5 font-bold"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <span>
                  00:{currentTime.toString().padStart(2, '0')} / 00:{DURATION}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white transition-colors p-1"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#d4ff32]" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="hover:text-white transition-colors p-1"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
