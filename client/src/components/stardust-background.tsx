import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "normal" | "large" | "constellation";
}

export default function StardustBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const type = "constellation";
      const size = 0.8;
      let spawnX: number;
      let spawnY: number;
      let vx: number;
      let vy: number;

      // Constellation particles spawn from various locations
      if (Math.random() < 0.5) {
        spawnX = Math.random() < 0.5 ? -10 : canvas.width + 10;
        spawnY = Math.random() * canvas.height;
        vx = spawnX < 0 ? Math.random() * 2 + 0.5 : -(Math.random() * 2 + 0.5);
        vy = (Math.random() - 0.5) * 1;
      } else {
        spawnX = Math.random() * canvas.width;
        spawnY = canvas.height + 30;
        vx = (Math.random() - 0.5) * 0.5;
        vy = -Math.random() * 1.5 - 1;
      }

      return {
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        life: 0,
        maxLife: Math.random() * 500 + 400,
        size,
        type,
      };
    };

    const updateParticles = () => {
      const maxParticles = isMobile ? 25 : 50;

      // Add new particles
      if (particlesRef.current.length < maxParticles && Math.random() < 0.3) {
        particlesRef.current.push(createParticle());
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        return (
          particle.life < particle.maxLife &&
          particle.x >= -10 &&
          particle.x <= canvas.width + 10 &&
          particle.y >= -10
        );
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        const alpha = Math.max(0, 1 - particle.life / particle.maxLife);
        const baseSize = particle.size;
        const twinkleSize = baseSize;

        ctx.save();

        // All particles are tiny with minimal glow
        const glowMultiplier = 1.1;
        const alphaMultiplier = 1;
        const colorIntensity = 1;

        ctx.globalAlpha = alpha * alphaMultiplier;

        // Create gradient for particle glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          twinkleSize * 4 * glowMultiplier,
        );

        // Vary colors for more visual interest
        const colorVariant = Math.sin(particle.life * 0.05) * 0.5 + 0.5;
        const primaryColor = `rgba(245, 156, 113, ${alpha * colorIntensity})`;
        const accentColor = `rgba(244, 137, 91, ${alpha * 0.7 * colorIntensity})`;
        const whiteCore = `rgba(255, 255, 255, ${alpha * 1.5})`;
        const blueAccent = `rgba(173, 216, 230, ${alpha * 0.8})`;

        // Constellation color scheme for all particles
        gradient.addColorStop(0, whiteCore);
        gradient.addColorStop(
          0.2,
          colorVariant > 0.5 ? blueAccent : primaryColor,
        );
        gradient.addColorStop(0.6, accentColor);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          twinkleSize * 3 * glowMultiplier,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Add tiny bright core
        ctx.globalAlpha = alpha * 1.8 * alphaMultiplier;
        ctx.fillStyle = whiteCore;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          Math.max(0.3, twinkleSize * 0.2),
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Removed sparkle effect to keep particles consistently tiny

        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
      // Clear particles on resize to prevent visual artifacts
      particlesRef.current = [];
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
