import React, { useEffect, useRef } from 'react';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle floating grooming & neon ambient particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * -0.4 - 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.4 ? '#d4ff32' : '#ffffff',
      pulse: Math.random() * Math.PI * 2
    }));

    // Light streak lines
    const streaks = Array.from({ length: 4 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 180 + 80,
      angle: -0.4,
      speed: Math.random() * 0.6 + 0.3,
      opacity: Math.random() * 0.15 + 0.05
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render ambient soft light streak rays
      streaks.forEach((s) => {
        ctx.save();
        ctx.beginPath();
        const endX = s.x + Math.cos(s.angle) * s.length;
        const endY = s.y + Math.sin(s.angle) * s.length;
        const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
        grad.addColorStop(0, 'rgba(212, 255, 50, 0)');
        grad.addColorStop(0.5, `rgba(212, 255, 50, ${s.opacity})`);
        grad.addColorStop(1, 'rgba(212, 255, 50, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        s.y -= s.speed;
        s.x -= s.speed * 0.5;
        if (s.y < -s.length || s.x < -s.length) {
          s.y = height + 50;
          s.x = Math.random() * width + 100;
        }
      });

      // Render floating micro-particles
      particles.forEach((p) => {
        p.pulse += 0.02;
        const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, currentOpacity);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Volumetric Radial Spotlights */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#d4ff32]/[0.07] via-emerald-500/[0.03] to-transparent rounded-full blur-[120px]" />
      <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-[#d4ff32]/[0.03] rounded-full blur-[140px]" />
      <div className="absolute top-[70%] -right-[10%] w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[140px]" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
