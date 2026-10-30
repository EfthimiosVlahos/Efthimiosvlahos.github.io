"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DISTANCE = 140;

/**
 * A slow-drifting network behind the hero: nodes link when they come close, and the pointer
 * pulls nearby nodes into its own links. Static under reduced motion; paused when off-screen.
 */
export function HeroNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let color = "96 165 250";
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    const readColor = () => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--blue").trim();
      const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
      if (m && m[1] && m[2] && m[3]) color = `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i] as Particle;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j] as Particle;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx.strokeStyle = `rgb(${color} / ${0.22 * (1 - d / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dp < LINK_DISTANCE * 1.3) {
          ctx.strokeStyle = `rgb(${color} / ${0.45 * (1 - dp / (LINK_DISTANCE * 1.3))})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgb(${color} / 0.65)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion) draw();
      else raf = requestAnimationFrame(tick);
    };

    readColor();
    resize();
    start();

    const onResize = () => {
      resize();
      if (reduceMotion) draw();
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onVisibility = () => !document.hidden && visible && start();

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
    });
    io.observe(canvas);
    const themeWatch = new MutationObserver(() => {
      readColor();
      if (reduceMotion) draw();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
