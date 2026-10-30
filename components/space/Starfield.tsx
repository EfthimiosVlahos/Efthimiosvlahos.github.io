"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
  speed: number;
  hue: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

/** Deterministic stars so the sky is the same on every visit. */
function makeStars(count: number): Star[] {
  let s = 20260430;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const depth = rand();
    return {
      x: rand(),
      y: rand(),
      r: 0.3 + depth * depth * 1.6,
      depth,
      phase: rand() * Math.PI * 2,
      speed: 0.4 + rand() * 1.4,
      // Mostly white, a few blue and warm stars, like a real sky.
      hue: rand() < 0.8 ? 0 : rand() < 0.6 ? 215 : 40,
    };
  });
}

/**
 * A sticky night sky behind the Off the clock page: parallax on scroll and pointer, twinkling,
 * and the occasional shooting star. Static under reduced motion; paused when the tab is hidden.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = makeStars(420);
    const meteors: Meteor[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let nextMeteor = performance.now() + 2500;
    const pointer = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;
      for (const st of stars) {
        const px = (st.x * w + pointer.x * st.depth * 14 + w) % w;
        const py = (((st.y * h - scroll * st.depth * 0.18 + pointer.y * st.depth * 10) % h) + h) % h;
        const twinkle = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * st.speed + st.phase);
        const alpha = (0.25 + st.depth * 0.75) * twinkle;
        ctx.fillStyle = st.hue === 0 ? `rgb(235 240 255 / ${alpha})` : `hsl(${st.hue} 90% 80% / ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, st.r, 0, Math.PI * 2);
        ctx.fill();
        if (st.r > 1.4) {
          ctx.fillStyle = `rgb(180 200 255 / ${alpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(px, py, st.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i] as Meteor;
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 1;
        const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
        tail.addColorStop(0, `rgb(255 255 255 / ${Math.min(1, m.life / 30)})`);
        tail.addColorStop(1, "rgb(255 255 255 / 0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
        ctx.stroke();
        if (m.life <= 0) meteors.splice(i, 1);
      }
    };

    const tick = (t: number) => {
      if (t > nextMeteor) {
        meteors.push({ x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.4, vx: -(6 + Math.random() * 4), vy: 2.5 + Math.random() * 2, life: 60 });
        nextMeteor = t + 6000 + Math.random() * 7000;
      }
      draw(t);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(tick);

    const onResize = () => {
      resize();
      if (reduce) draw(0);
    };
    const onScroll = () => reduce && draw(0);
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onVisibility = () => {
      if (!document.hidden && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />;
}
