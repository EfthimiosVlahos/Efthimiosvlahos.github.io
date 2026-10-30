"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { advance, canKick, kick, newBall, RADIUS, type Ball } from "@/lib/keepy";

const ASPECT = 1.15; // height / width of the playing area
type Phase = "ready" | "playing" | "dropped";

/** Best score lives in localStorage; this store lets React read it without a mismatch on first render. */
const BEST_KEY = "keepy-best";
const bestStore = {
  subscribe(cb: () => void) {
    window.addEventListener("storage", cb);
    window.addEventListener("keepy-best", cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener("keepy-best", cb);
    };
  },
  read(): number {
    try {
      return Number(localStorage.getItem(BEST_KEY) ?? 0);
    } catch {
      return 0;
    }
  },
  write(n: number) {
    try {
      localStorage.setItem(BEST_KEY, String(n));
    } catch {
      // Storage blocked: the best score just won't persist.
    }
    window.dispatchEvent(new Event("keepy-best"));
  },
};

/** A Sunday league warm-up: tap the ball to keep it up. Real gravity, spin from where you hit it. */
export function KeepyUppy() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ball = useRef<Ball>(newBall());
  const phaseRef = useRef<Phase>("ready");
  const scoreRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBall = (b: Ball) => {
      const x = b.x * w;
      const y = (b.y / ASPECT) * h;
      const r = RADIUS * w;
      ctx.save();
      ctx.translate(x, y);
      // Shadow on the grass, smaller the higher the ball.
      ctx.save();
      ctx.translate(0, h - y - 8);
      const s = 0.4 + 0.6 * (b.y / ASPECT);
      ctx.fillStyle = `rgb(0 0 0 / ${0.35 * s})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * s, r * 0.3 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.rotate(b.angle);
      ctx.fillStyle = "#f8fafc";
      ctx.shadowColor = "rgb(180 200 255 / 0.8)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        ctx[k ? "lineTo" : "moveTo"](Math.cos(a) * r * 0.38, Math.sin(a) * r * 0.38);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = Math.max(1, r * 0.07);
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.38, Math.sin(a) * r * 0.38);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      // Floodlit grass at the bottom.
      const grass = ctx.createLinearGradient(0, h * 0.82, 0, h);
      grass.addColorStop(0, "rgb(34 197 94 / 0)");
      grass.addColorStop(1, "rgb(34 197 94 / 0.28)");
      ctx.fillStyle = grass;
      ctx.fillRect(0, h * 0.82, w, h * 0.18);
      ctx.strokeStyle = "rgb(190 215 255 / 0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h - 8);
      ctx.lineTo(w, h - 8);
      ctx.stroke();

      if (phaseRef.current === "playing") {
        const { ball: next, dropped } = advance(ball.current, dt, ASPECT);
        ball.current = next;
        if (dropped) {
          phaseRef.current = "dropped";
          setPhase("dropped");
          if (scoreRef.current > bestStore.read()) bestStore.write(scoreRef.current);
        }
      }
      drawBall(ball.current);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    const onResize = () => resize();
    const onVisibility = () => {
      if (!document.hidden) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const touch = (px: number, py: number) => {
    if (phaseRef.current !== "playing") {
      ball.current = newBall();
      scoreRef.current = 0;
      setScore(0);
      phaseRef.current = "playing";
      setPhase("playing");
      return;
    }
    if (canKick(ball.current, px, py)) {
      ball.current = kick(ball.current, px);
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-rule px-5 py-3 text-sm">
        <span>
          Touches: <span className="font-bold tabular-nums">{score}</span>
        </span>
        <span className="text-soft">
          Best: <span className="font-semibold tabular-nums text-ink">{best}</span>
        </span>
      </div>
      <div className="relative">
        <canvas
          ref={canvas}
          className="block w-full cursor-pointer touch-none select-none"
          style={{ aspectRatio: `1 / ${ASPECT}` }}
          tabIndex={0}
          role="application"
          aria-label="Keepy-uppy game. Click or tap the ball to kick it up; press Space to kick with the keyboard."
          onPointerDown={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            touch((e.clientX - r.left) / r.width, ((e.clientY - r.top) / r.height) * ASPECT);
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              // Keyboard players get a perfect touch, right under the ball.
              touch(ball.current.x, ball.current.y);
            }
          }}
        />
        {phase !== "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-[38%] text-center" aria-live="polite">
            <p className="text-xl font-bold">{phase === "ready" ? "Tap to start" : `Dropped. ${score} touches.`}</p>
            <p className="mt-1 text-sm text-soft">
              {phase === "ready" ? "Then tap the ball to keep it up." : "Tap to go again."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
