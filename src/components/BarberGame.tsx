import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scissors, Zap, Sparkles, RotateCcw, Volume2, VolumeX, AlertCircle, CheckCircle2, Trophy, LogIn } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BarberTool, CutEvaluation, HairSection } from '../types';
import { playScissors, playTrimmerCut, playShaver, playFaceWarning, playSuccessChime, toggleSound, isSoundEnabled } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { saveGameScore } from '../services/firestore';

// Initial Hair Sections layout around the 3D-styled mannequin head
const INITIAL_HAIR_SECTIONS: HairSection[] = [
  // Top Volume / Pompadour
  { id: 'top_1', name: 'High Pompadour Crest', category: 'top', side: 'center', x: 50, y: 14, width: 90, height: 42, path: 'M 35,28 C 42,6 58,6 65,28 C 58,22 42,22 35,28 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'top_left', name: 'Left Crown Volume', category: 'top', side: 'left', x: 38, y: 19, width: 50, height: 35, path: 'M 22,34 C 26,16 40,16 45,28 C 36,26 28,30 22,34 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'top_right', name: 'Right Crown Volume', category: 'top', side: 'right', x: 62, y: 19, width: 50, height: 35, path: 'M 55,28 C 60,16 74,16 78,34 C 72,30 64,26 55,28 Z', initialLength: 100, currentLength: 100, isCut: false },

  // Forehead Fringe / Quiff
  { id: 'fringe_mid', name: 'Front Quiff Sweep', category: 'fringe', side: 'center', x: 50, y: 25, width: 60, height: 25, path: 'M 36,33 C 44,25 56,25 64,33 C 55,36 45,36 36,33 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'fringe_left', name: 'Left Fringe Taper', category: 'fringe', side: 'left', x: 30, y: 28, width: 35, height: 25, path: 'M 19,39 C 24,30 33,32 35,36 C 28,38 23,41 19,39 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'fringe_right', name: 'Right Fringe Taper', category: 'fringe', side: 'right', x: 70, y: 28, width: 35, height: 25, path: 'M 65,36 C 67,32 76,30 81,39 C 77,41 72,38 65,36 Z', initialLength: 100, currentLength: 100, isCut: false },

  // Upper Sides / Temples
  { id: 'temple_left_up', name: 'Left Upper Temple', category: 'sides_left', side: 'left', x: 23, y: 36, width: 30, height: 25, path: 'M 14,44 C 17,35 24,35 27,42 C 22,46 17,47 14,44 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'temple_right_up', name: 'Right Upper Temple', category: 'sides_right', side: 'right', x: 77, y: 36, width: 30, height: 25, path: 'M 73,42 C 76,35 83,35 86,44 C 83,47 78,46 73,42 Z', initialLength: 100, currentLength: 100, isCut: false },

  // Mid Sides
  { id: 'side_left_mid', name: 'Left Mid Fade Layer', category: 'sides_left', side: 'left', x: 20, y: 46, width: 28, height: 30, path: 'M 13,54 C 14,45 22,45 25,51 C 21,55 17,57 13,54 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'side_right_mid', name: 'Right Mid Fade Layer', category: 'sides_right', side: 'right', x: 80, y: 46, width: 28, height: 30, path: 'M 75,51 C 78,45 86,45 87,54 C 83,57 79,55 75,51 Z', initialLength: 100, currentLength: 100, isCut: false },

  // Sideburns
  { id: 'burns_left', name: 'Left Sharp Sideburn', category: 'burns', side: 'left', x: 23, y: 58, width: 20, height: 25, path: 'M 18,65 C 18,58 24,57 24,63 C 21,68 19,69 18,65 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'burns_right', name: 'Right Sharp Sideburn', category: 'burns', side: 'right', x: 77, y: 58, width: 20, height: 25, path: 'M 76,63 C 76,57 82,58 82,65 C 81,69 79,68 76,63 Z', initialLength: 100, currentLength: 100, isCut: false },

  // Nape and Low Taper
  { id: 'nape_left', name: 'Left Nape Taper', category: 'nape', side: 'left', x: 28, y: 66, width: 24, height: 20, path: 'M 21,72 C 22,65 29,66 30,71 C 26,74 23,74 21,72 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'nape_right', name: 'Right Nape Taper', category: 'nape', side: 'right', x: 72, y: 66, width: 24, height: 20, path: 'M 70,71 C 71,66 78,65 79,72 C 77,74 74,74 70,71 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'nape_center', name: 'Neckline Clean Edge', category: 'nape', side: 'center', x: 50, y: 74, width: 35, height: 18, path: 'M 38,76 C 44,72 56,72 62,76 C 55,79 45,79 38,76 Z', initialLength: 100, currentLength: 100, isCut: false },

  // Crown Back Depth
  { id: 'crown_back_left', name: 'Left Crown Edge', category: 'crown', side: 'left', x: 26, y: 22, width: 35, height: 30, path: 'M 12,30 C 16,18 26,20 28,29 C 20,31 15,33 12,30 Z', initialLength: 100, currentLength: 100, isCut: false },
  { id: 'crown_back_right', name: 'Right Crown Edge', category: 'crown', side: 'right', x: 74, y: 22, width: 35, height: 30, path: 'M 72,29 C 74,20 84,18 88,30 C 85,33 80,31 72,29 Z', initialLength: 100, currentLength: 100, isCut: false }
];

interface FallingHairParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  opacity: number;
}

export const BarberGame: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [selectedTool, setSelectedTool] = useState<BarberTool>('scissors');
  const [hairSections, setHairSections] = useState<HairSection[]>(INITIAL_HAIR_SECTIONS);
  const [scorePercent, setScorePercent] = useState<number>(0);
  const [faceWarning, setFaceWarning] = useState<string | null>(null);
  const [isFaceFlinching, setIsFaceFlinching] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<CutEvaluation | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [particles, setParticles] = useState<FallingHairParticle[]>([]);
  const [isTrimmerActive, setIsTrimmerActive] = useState<boolean>(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [shaverUsedCount, setShaverUsedCount] = useState<number>(0);
  const [usedTools, setUsedTools] = useState<Set<string>>(new Set(['scissors']));
  const [scoreSavedToFirestore, setScoreSavedToFirestore] = useState<boolean>(false);
  const hasSavedScoreRef = useRef<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle Sound
  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  // Add falling hair particles
  const spawnHairParticles = (cx: number, cy: number, count = 12) => {
    const newParticles: FallingHairParticle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x: cx + (Math.random() * 20 - 10),
        y: cy + (Math.random() * 15 - 7),
        color: Math.random() > 0.3 ? '#161a22' : '#2b3240',
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        size: Math.random() * 6 + 3,
        opacity: 1
      });
    }
    setParticles((prev) => [...prev.slice(-30), ...newParticles]);
  };

  // Animate falling hair particles on canvas
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles((prevParticles) => {
        if (prevParticles.length === 0) return prevParticles;

        return prevParticles
          .map((p) => {
            const nextX = p.x + p.vx;
            const nextY = p.y + p.vy;
            const nextRot = p.rotation + p.rotSpeed;
            const nextOpacity = p.opacity - 0.025;

            // Draw hair strand
            ctx.save();
            ctx.translate(nextX, nextY);
            ctx.rotate((nextRot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, nextOpacity);
            ctx.fillRect(-p.size / 2, -1, p.size, 2);
            ctx.restore();

            return {
              ...p,
              x: nextX,
              y: nextY,
              vy: p.vy + 0.15, // gravity
              rotation: nextRot,
              opacity: nextOpacity
            };
          })
          .filter((p) => p.opacity > 0 && p.y < canvas.height);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Calculate cut quality evaluation
  const evaluateHaircut = useCallback((sections: HairSection[], shaverCount: number) => {
    const total = sections.length;
    const cutCount = sections.filter((s) => s.isCut).length;
    const pct = Math.round((cutCount / total) * 100);

    // Left vs Right symmetry check
    const leftSections = sections.filter((s) => s.side === 'left');
    const rightSections = sections.filter((s) => s.side === 'right');
    const leftCut = leftSections.filter((s) => s.isCut).length;
    const rightCut = rightSections.filter((s) => s.isCut).length;

    const leftCutRatio = leftSections.length ? leftCut / leftSections.length : 1;
    const rightCutRatio = rightSections.length ? rightCut / rightSections.length : 1;
    const symmetryDelta = Math.abs(leftCutRatio - rightCutRatio);

    let quality: CutEvaluation['quality'] = null;
    let headline = '';
    let message = '';

    if (pct < 35) {
      // Still in progress
      setEvaluation(null);
      return;
    }

    if (symmetryDelta > 0.38) {
      quality = 'poor';
      headline = 'Hmm… one more pass 😅';
      message = 'The shape is a little uneven. Give it another try.';
    } else if (pct >= 85 && symmetryDelta <= 0.15 && shaverCount >= 2) {
      quality = 'very_good';
      headline = 'Nice one, barber! ✂️';
      message = 'Sharp work. That style is looking fresh.';
      playSuccessChime(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4ff32', '#ffffff', '#22c55e']
      });
    } else if (pct >= 55 && symmetryDelta <= 0.25) {
      quality = 'good';
      headline = 'Yeah, you done good! 🔥';
      message = 'That is a seriously clean cut. The client is ready to step out.';
      playSuccessChime(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4ff32', '#e2e8f0']
      });
    } else if (pct >= 45 && symmetryDelta > 0.25) {
      quality = 'poor';
      headline = 'Hmm… one more pass 😅';
      message = 'The shape is a little uneven. Give it another try.';
    }

    if (quality) {
      const evalResult = {
        quality,
        headline,
        message,
        symmetryScore: Math.round((1 - symmetryDelta) * 100),
        finishScore: Math.min(100, shaverCount * 30 + 40),
        hairRemovedPct: pct
      };
      setEvaluation(evalResult);

      // Save score to Firestore if user is authenticated
      if (user && !hasSavedScoreRef.current && (quality === 'good' || quality === 'very_good')) {
        hasSavedScoreRef.current = true;
        const totalPts = Math.round(evalResult.symmetryScore * 8 + evalResult.finishScore * 2);
        saveGameScore({
          userId: user.uid,
          score: totalPts,
          haircutQuality: quality === 'very_good' ? 'Master Barber Cut' : 'Clean Modern Style',
          selectedTools: Array.from(usedTools),
          completionPercentage: pct,
          timestamp: new Date().toISOString()
        })
          .then(() => setScoreSavedToFirestore(true))
          .catch((err) => console.error('Failed to save game score:', err));
      }
    }
  }, [user, usedTools]);

  // Update Score and check evaluation whenever hair changes
  useEffect(() => {
    const total = hairSections.length;
    const cutCount = hairSections.filter((s) => s.isCut).length;
    const rawPct = (cutCount / total) * 100;
    
    // Snap/quantize nicely into progressive steps: 0%, 25%, 50%, 75%, 100%
    let displayScore = 0;
    if (rawPct >= 95) displayScore = 100;
    else if (rawPct >= 70) displayScore = 75;
    else if (rawPct >= 40) displayScore = 50;
    else if (rawPct >= 15) displayScore = 25;
    else displayScore = 0;

    setScorePercent(displayScore);

    if (rawPct >= 40) {
      evaluateHaircut(hairSections, shaverUsedCount);
    }
  }, [hairSections, shaverUsedCount, evaluateHaircut]);

  // Click / interaction on a hair section
  const handleCutSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setUsedTools((prev) => new Set(prev).add(selectedTool));

    // Calculate click coordinates in container for particles
    const rect = containerRef.current?.getBoundingClientRect();
    const clickX = rect ? event.clientX - rect.left : 200;
    const clickY = rect ? event.clientY - rect.top : 150;

    // Tool audio & cutting action
    if (selectedTool === 'scissors') {
      playScissors();
      spawnHairParticles(clickX, clickY, 14);
    } else if (selectedTool === 'trimmer') {
      playTrimmerCut();
      setIsTrimmerActive(true);
      setTimeout(() => setIsTrimmerActive(false), 220);
      spawnHairParticles(clickX, clickY, 20);
    } else if (selectedTool === 'shaver') {
      playShaver();
      setShaverUsedCount((c) => c + 1);
      spawnHairParticles(clickX, clickY, 10);
    }

    setHairSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, isCut: true, currentLength: 0 };
        }
        return sec;
      })
    );
  };

  // Face click handler (FACE PROTECTION)
  const handleFaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playFaceWarning();
    setIsFaceFlinching(true);
    setFaceWarning('Easy there 😄 Aim for the hair, not the face.');

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    warningTimerRef.current = setTimeout(() => {
      setFaceWarning(null);
      setIsFaceFlinching(false);
    }, 3200);
  };

  // Reset Game
  const handleReset = () => {
    setHairSections(INITIAL_HAIR_SECTIONS.map((s) => ({ ...s, isCut: false, currentLength: 100 })));
    setScorePercent(0);
    setEvaluation(null);
    setFaceWarning(null);
    setIsFaceFlinching(false);
    setShaverUsedCount(0);
    setParticles([]);
    setScoreSavedToFirestore(false);
    hasSavedScoreRef.current = false;
    setUsedTools(new Set(['scissors']));
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl p-6 sm:p-7 glass-panel-neon transition-all duration-300 shadow-2xl border border-[#d4ff32]/30">
      {/* Background ambient glow inside card */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d4ff32]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Headline + Audio & Reset controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#d4ff32] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4ff32]" /> DID YOU KNOW?
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5 font-display">
            BARBER GAME SIMULATOR
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute / Unmute */}
          <button
            onClick={handleToggleSound}
            aria-label={soundOn ? 'Mute game sound' : 'Unmute game sound'}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title={soundOn ? 'Sound On' : 'Sound Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#d4ff32]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#d4ff32]/15 text-xs font-semibold text-slate-200 hover:text-[#d4ff32] transition-all border border-white/10 hover:border-[#d4ff32]/40"
            title="Reset Haircut"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Score and Dynamic Progress Bar */}
      <div className="mb-5 bg-black/40 rounded-2xl p-3.5 border border-white/5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-mono font-medium text-slate-400">HAIRCUT PRECISION</span>
          <span className="text-xs font-mono font-bold text-[#d4ff32] tracking-wider transition-all duration-300">
            STYLE {scorePercent}%
          </span>
        </div>
        <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
          <div
            className="bg-gradient-to-r from-emerald-500 via-[#bef264] to-[#d4ff32] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(212,255,50,0.6)]"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* BARBER TOOLS SELECTOR (Scissors, Trimmer, Shaver) */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {/* 1. SCISSORS */}
        <button
          type="button"
          onClick={() => setSelectedTool('scissors')}
          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all border relative overflow-hidden group ${
            selectedTool === 'scissors'
              ? 'bg-[#d4ff32]/15 border-[#d4ff32] text-[#d4ff32] shadow-[0_0_15px_rgba(212,255,50,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]'
          }`}
        >
          <Scissors className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${selectedTool === 'scissors' ? 'rotate-12' : ''}`} />
          <span className="text-xs font-bold tracking-wide">1. ✂ SCISSORS</span>
          <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline">Precision Cut</span>
        </button>

        {/* 2. TRIMMER */}
        <button
          type="button"
          onClick={() => setSelectedTool('trimmer')}
          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all border relative overflow-hidden group ${
            selectedTool === 'trimmer'
              ? 'bg-[#d4ff32]/15 border-[#d4ff32] text-[#d4ff32] shadow-[0_0_15px_rgba(212,255,50,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]'
          }`}
        >
          <Zap className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${selectedTool === 'trimmer' ? 'animate-pulse' : ''}`} />
          <span className="text-xs font-bold tracking-wide">2. ▰ TRIMMER</span>
          <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline">Rapid Bulk Cut</span>
        </button>

        {/* 3. SHAVER */}
        <button
          type="button"
          onClick={() => setSelectedTool('shaver')}
          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all border relative overflow-hidden group ${
            selectedTool === 'shaver'
              ? 'bg-[#d4ff32]/15 border-[#d4ff32] text-[#d4ff32] shadow-[0_0_15px_rgba(212,255,50,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]'
          }`}
        >
          <Sparkles className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${selectedTool === 'shaver' ? 'rotate-45' : ''}`} />
          <span className="text-xs font-bold tracking-wide">3. ▱ SHAVER</span>
          <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline">Clean Fade Finish</span>
        </button>
      </div>

      {/* Face Warning Notification */}
      {faceWarning && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm animate-bounce font-medium shadow-lg"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{faceWarning}</span>
        </div>
      )}

      {/* 3D MANNEQUIN HEAD VIEWPORT & HAIR INTERACTION CANVAS */}
      <div
        ref={containerRef}
        className={`relative w-full h-[320px] sm:h-[350px] bg-gradient-to-b from-[#11141a] to-[#0c0e12] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center select-none shadow-inner ${
          isTrimmerActive ? 'animate-buzz' : ''
        }`}
      >
        {/* Hair Falling Particle Canvas */}
        <canvas
          ref={canvasRef}
          width={520}
          height={350}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* 3D Lighting & Radial Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,255,50,0.06),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

        {/* Stylized 3D Mannequin Head SVG */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full max-w-[340px] max-h-[340px] transition-transform duration-200 ${
            isFaceFlinching ? 'scale-95 rotate-2' : 'hover:scale-[1.01]'
          }`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Skin Shading Gradient */}
            <radialGradient id="skinGrad" cx="50%" cy="45%" r="45%" fx="45%" fy="40%">
              <stop offset="0%" stopColor="#f5cfb3" />
              <stop offset="70%" stopColor="#d99f79" />
              <stop offset="100%" stopColor="#a36540" />
            </radialGradient>

            {/* Hair Active Gradient */}
            <linearGradient id="hairGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e222b" />
              <stop offset="50%" stopColor="#0d0f14" />
              <stop offset="100%" stopColor="#1a1d24" />
            </linearGradient>

            {/* Hair Highlight Gradient */}
            <linearGradient id="hairHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#3d4454" />
              <stop offset="50%" stopColor="#1a1d24" />
              <stop offset="100%" stopColor="#0c0e12" />
            </linearGradient>

            {/* Neon Cut Stubble Gradient */}
            <linearGradient id="stubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4ff32" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* NECK / COLLAR */}
          <path d="M 41,75 L 39,94 L 61,94 L 59,75 Z" fill="#b0734a" />
          <path d="M 32,92 C 40,88 60,88 68,92 L 72,100 L 28,100 Z" fill="#181c24" stroke="#252a36" strokeWidth="0.8" />
          <text x="50" y="97.5" textAnchor="middle" fill="#d4ff32" fontSize="2.8" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">
            CHEAP &amp; BEST
          </text>

          {/* EARS */}
          {/* Left Ear */}
          <ellipse cx="23" cy="54" rx="4.5" ry="7" fill="#d99f79" stroke="#9e6038" strokeWidth="0.5" />
          <ellipse cx="23.5" cy="54" rx="2.5" ry="4.5" fill="#b87a53" />
          {/* Right Ear */}
          <ellipse cx="77" cy="54" rx="4.5" ry="7" fill="#d99f79" stroke="#9e6038" strokeWidth="0.5" />
          <ellipse cx="76.5" cy="54" rx="2.5" ry="4.5" fill="#b87a53" />

          {/* FACE SURFACE (Clickable with Face Protection Warning!) */}
          <g
            id="face-clickable-target"
            onClick={handleFaceClick}
            className="cursor-not-allowed group transition-all"
            role="button"
            aria-label="Mannequin Face"
          >
            {/* Main Face Contour (Head Oval) */}
            <path
              d="M 27,42 C 27,27 73,27 73,42 C 73,59 66,75 50,77 C 34,75 27,59 27,42 Z"
              fill="url(#skinGrad)"
              stroke="#8c502b"
              strokeWidth="0.6"
              className="transition-colors group-hover:brightness-105"
            />

            {/* EYEBROWS */}
            <path d="M 33,42 Q 40,39 45,42" fill="none" stroke="#12151c" strokeWidth="2" strokeLinecap="round" />
            <path d="M 55,42 Q 60,39 67,42" fill="none" stroke="#12151c" strokeWidth="2" strokeLinecap="round" />

            {/* EYES (Blinks when flinching) */}
            {isFaceFlinching ? (
              // Flinch winking eyes
              <>
                <path d="M 34,47 Q 39,50 44,47" fill="none" stroke="#0e1015" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 56,47 Q 61,50 66,47" fill="none" stroke="#0e1015" strokeWidth="1.8" strokeLinecap="round" />
              </>
            ) : (
              // Normal sharp focused eyes
              <>
                <ellipse cx="39" cy="47" rx="3.5" ry="2.2" fill="#ffffff" />
                <circle cx="39" cy="47" r="1.6" fill="#1e2430" />
                <circle cx="39.6" cy="46.3" r="0.6" fill="#ffffff" />

                <ellipse cx="61" cy="47" rx="3.5" ry="2.2" fill="#ffffff" />
                <circle cx="61" cy="47" r="1.6" fill="#1e2430" />
                <circle cx="61.6" cy="46.3" r="0.6" fill="#ffffff" />
              </>
            )}

            {/* NOSE */}
            <path d="M 50,45 L 48,56 L 52,56" fill="none" stroke="#9e6038" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* MOUTH / SMILE */}
            {scorePercent >= 75 ? (
              // Handsome confident smile when haircut is great!
              <path d="M 43,64 Q 50,69 57,64" fill="none" stroke="#6e3518" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              // Neutral relaxed lips
              <path d="M 44,65 Q 50,66 56,65" fill="none" stroke="#7e3c1d" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </g>

          {/* INDIVIDUAL HAIR SECTIONS (Interactive Cuttable Layer) */}
          <g id="interactive-hair-sections">
            {hairSections.map((sec) => {
              const isHovered = hoveredSection === sec.id;

              if (sec.isCut) {
                // RENDER CUT STUBBLE / SHARP FADE OUTLINE
                return (
                  <path
                    key={sec.id}
                    d={sec.path}
                    fill="url(#stubbleGrad)"
                    stroke="#d4ff32"
                    strokeWidth="0.4"
                    strokeDasharray="1,1"
                    opacity="0.35"
                    className="pointer-events-none transition-all duration-300"
                  />
                );
              }

              // RENDER FULL STYLED HAIR SECTION
              return (
                <path
                  key={sec.id}
                  d={sec.path}
                  fill={isHovered ? '#2d3545' : 'url(#hairGradDark)'}
                  stroke={isHovered ? '#d4ff32' : '#2a2f3d'}
                  strokeWidth={isHovered ? '1.2' : '0.6'}
                  filter={isHovered ? 'url(#neonGlow)' : undefined}
                  className="cursor-pointer transition-all duration-150 hover:brightness-125"
                  onMouseEnter={() => setHoveredSection(sec.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={(e) => handleCutSection(sec.id, e)}
                  aria-label={`${sec.name} — Click to cut with ${selectedTool}`}
                >
                  <title>{`${sec.name} — Click to cut with ${selectedTool}`}</title>
                </path>
              );
            })}
          </g>
        </svg>

        {/* Live Active Tool Feedback Indicator */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#d4ff32] animate-ping" />
          <span className="text-[11px] font-mono text-slate-300 uppercase">
            ACTIVE TOOL: <strong className="text-[#d4ff32]">{selectedTool}</strong>
          </span>
        </div>

        {/* Remaining sections counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-mono text-slate-300 pointer-events-none">
          {hairSections.filter((s) => !s.isCut).length} SECTIONS LEFT
        </div>
      </div>

      {/* HAIRCUT QUALITY POPUP / EVALUATION NOTIFICATION */}
      {evaluation && (
        <div
          role="region"
          aria-label="Haircut Evaluation"
          className={`mt-4 p-4 rounded-2xl border transition-all duration-500 shadow-xl ${
            evaluation.quality === 'very_good' || evaluation.quality === 'good'
              ? 'bg-[#d4ff32]/10 border-[#d4ff32]/40 text-white'
              : 'bg-amber-500/10 border-amber-400/40 text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {evaluation.quality === 'very_good' || evaluation.quality === 'good' ? (
                <div className="p-2 rounded-xl bg-[#d4ff32]/20 text-[#d4ff32] mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="text-base sm:text-lg font-bold font-display flex items-center gap-2">
                  {evaluation.headline}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {evaluation.message}
                </p>
                {/* Symmetry & Finish indicators */}
                <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-slate-400">
                  <span>SYMMETRY: <strong className="text-white">{evaluation.symmetryScore}%</strong></span>
                  <span>FINISH: <strong className="text-white">{evaluation.finishScore}%</strong></span>
                </div>

                {/* Firestore Persistence Status */}
                {scoreSavedToFirestore ? (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                    <Trophy className="w-3 h-3 text-[#d4ff32]" />
                    <span>Score Saved to Your Customer Profile & Leaderboard</span>
                  </div>
                ) : !user ? (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      💡 Guest mode active.
                    </span>
                    <button
                      onClick={openAuthModal}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-[#d4ff32] hover:underline"
                    >
                      <LogIn className="w-2.5 h-2.5" />
                      <span>Sign in to save scores</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Run It Again Button */}
            <button
              onClick={handleReset}
              className="shrink-0 ml-2 px-3 py-2 rounded-xl bg-[#d4ff32] text-black font-bold text-xs hover:bg-[#bef264] transition-all flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RUN IT AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Quick Play Instructions */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff32]" />
          Select tool &rarr; Tap hair sections &rarr; Keep symmetrical
        </span>
        <button
          onClick={handleReset}
          className="text-[#d4ff32] hover:underline font-mono text-xs flex items-center gap-1"
        >
          [ RUN IT AGAIN ]
        </button>
      </div>
    </div>
  );
};
