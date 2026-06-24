import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  theme: "dark" | "light";
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

const DARK_COLORS: ColorRGB[] = [
  { r: 129, g: 140, b: 248 }, // #818cf8 (indigo-400)
  { r: 167, g: 139, b: 250 }, // #a78bfa (violet-400)
  { r: 34,  g: 211, b: 238 }, // #22d3ee (cyan-400)
];

const LIGHT_COLORS: ColorRGB[] = [
  { r: 245, g: 158, b: 11  }, // #f59e0b (amber-500)
  { r: 99,  g: 102, b: 241 }, // #6366f1 (indigo-500)
];

class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  size: number = 0;
  alpha: number = 0;
  currentColor: ColorRGB = { r: 0, g: 0, b: 0 };
  targetColor: ColorRGB = { r: 0, g: 0, b: 0 };

  constructor(width: number, height: number, theme: "dark" | "light") {
    this.reset(width, height, true, theme);
  }

  reset(width: number, height: number, isInitial: boolean, theme: "dark" | "light") {
    this.x = Math.random() * width;
    this.y = isInitial ? Math.random() * height : height + 10;
    this.size = Math.random() * 3.5 + 1.5; // particles between 1.5px and 5px
    
    // Smooth, dynamic drifting velocities
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = -(Math.random() * 0.5 + 0.15); // upwards drift
    this.alpha = Math.random() * 0.5 + 0.35; // alpha between 0.35 and 0.85
    
    const palette = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
    const color = palette[Math.floor(Math.random() * palette.length)];
    
    if (isInitial) {
      this.currentColor = { ...color };
    }
    this.targetColor = { ...color };
  }

  setThemeColors(theme: "dark" | "light") {
    const palette = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
    this.targetColor = palette[Math.floor(Math.random() * palette.length)];
  }

  update(
    width: number,
    height: number,
    mouseX: number,
    mouseY: number,
    mouseVx: number,
    mouseVy: number,
    theme: "dark" | "light"
  ) {
    // 1. Smoothly interpolate color
    this.currentColor.r += (this.targetColor.r - this.currentColor.r) * 0.05;
    this.currentColor.g += (this.targetColor.g - this.currentColor.g) * 0.05;
    this.currentColor.b += (this.targetColor.b - this.currentColor.b) * 0.05;

    // 2. Mouse Attraction and Velocity Sweep Physics
    let forceX = 0;
    let forceY = 0;
    const dx = mouseX - this.x; // points TOWARDS the mouse
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const attractionRadius = 220; // Large area of influence

    if (distance < attractionRadius && distance > 0) {
      // Stronger force the closer the mouse is
      const factor = (attractionRadius - distance) / attractionRadius;
      
      // A. Gravitational Attraction (pulls particles to the cursor position)
      const pullStrength = 0.95;
      const pullX = (dx / distance) * factor * pullStrength;
      const pullY = (dy / distance) * factor * pullStrength;
      
      // B. Velocity Sweep (sweeps particles in the direction the mouse is moving)
      const sweepStrength = 0.55;
      const sweepX = mouseVx * factor * sweepStrength;
      const sweepY = mouseVy * factor * sweepStrength;
      
      forceX = pullX + sweepX;
      forceY = pullY + sweepY;
    }

    // 3. Move particle with drift + mouse forces
    this.x += this.vx + forceX;
    this.y += this.vy + forceY;

    // C. Soft friction drag when very close to mouse to prevent clumping
    if (distance < 50) {
      this.x += (mouseX - this.x) * 0.025;
      this.y += (mouseY - this.y) * 0.025;
    }

    // 4. Boundary check and recycle particles (including bottom and top)
    if (this.y < -10 || this.x < -10 || this.x > width + 10 || this.y > height + 10) {
      this.reset(width, height, false, theme);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    const { r, g, b } = this.currentColor;
    
    const red = Math.round(r);
    const green = Math.round(g);
    const blue = Math.round(b);
    
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
    ctx.shadowBlur = this.size * 1.5;
    ctx.shadowColor = `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
    ctx.fill();
  }
}

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
  });
  const themeRef = useRef(theme);

  // Sync the theme ref when theme changes
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 95; // Higher density of stars

    // Initialize canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles using the initial theme
    const initialTheme = themeRef.current;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height, initialTheme));
    }

    // Mouse move and velocity tracking
    let lastX = -1000;
    let lastY = -1000;
    let lastTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      lastTime = now;

      let vx = 0;
      let vy = 0;
      if (lastX !== -1000) {
        // Calculate velocity scaled to ~1 frame (16ms)
        vx = ((e.clientX - lastX) / dt) * 16;
        vy = ((e.clientY - lastY) / dt) * 16;
      }

      // Clamp max velocity to prevent crazy speed spikes
      const maxV = 20;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > maxV) {
        vx = (vx / speed) * maxV;
        vy = (vy / speed) * maxV;
      }

      lastX = e.clientX;
      lastY = e.clientY;

      mouseRef.current = { x: e.clientX, y: e.clientY, vx, vy };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Mouse leave tracking to stop attraction and clear velocity
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, vx: 0, vy: 0 };
      lastX = -1000;
      lastY = -1000;
    };
    window.addEventListener("mouseleave", handleMouseLeave);

    // Local variable to track active theme within the loop
    let activeTheme = initialTheme;

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;

      // Decay mouse velocity slowly so it slows down when mouse stops
      mouseRef.current.vx *= 0.94;
      mouseRef.current.vy *= 0.94;

      // Check if theme has changed in React state
      const currentTheme = themeRef.current;
      if (currentTheme !== activeTheme) {
        particles.forEach((p) => p.setThemeColors(currentTheme));
        activeTheme = currentTheme;
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(
          canvas.width,
          canvas.height,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.vx,
          mouseRef.current.vy,
          currentTheme
        );
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 opacity-90 dark:opacity-60"
    />
  );
}
