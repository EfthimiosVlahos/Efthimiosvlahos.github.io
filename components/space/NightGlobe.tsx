"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";

/** ISO 3166 numeric ids in world-atlas. */
const LIT: Record<string, string> = { "300": "Greece", "380": "Italy" };
/** Resting view: centered over the Ionian Sea, between the two. */
const HOME: [number, number] = [-19, -38.5];

/**
 * A night-side globe that always drifts back to the Mediterranean, with Greece and Italy glowing
 * like city lights. Drag (or use the arrow keys) to spin it. The map data loads only when the
 * globe nears the viewport.
 */
export function NightGlobe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;

    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    const start = async () => {
      try {
        const [d3, topo, world] = await Promise.all([
          import("d3-geo"),
          import("topojson-client"),
          import("world-atlas/countries-110m.json"),
        ]);
        if (disposed) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (world as any).default ?? world;
        const land = topo.feature(data, data.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
        const countries = land.features.filter((f) => f.properties.name !== "Antarctica");
        const lit = countries.filter((f) => String(f.id) in LIT);
        const graticule = d3.geoGraticule10();
        // Canvas can't read CSS variables, so resolve the site font's real family name once.
        const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-inter").trim() || "system-ui, sans-serif";
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

        let size = 0;
        const rot: [number, number] = [HOME[0] + 50, HOME[1] + 12];
        let dragging = false;
        let last: [number, number] | null = null;
        let visible = true;

        const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
        const path = d3.geoPath(projection, ctx);

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          size = cv.clientWidth;
          cv.width = Math.round(size * dpr);
          cv.height = Math.round(size * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          projection.translate([size / 2, size / 2]).scale(size * 0.4);
        };

        const draw = () => {
          const r = size * 0.4;
          const c = size / 2;
          ctx.clearRect(0, 0, size, size);

          const halo = ctx.createRadialGradient(c, c, r * 0.92, c, c, r * 1.32);
          halo.addColorStop(0, "rgba(90,140,255,0.35)");
          halo.addColorStop(0.35, "rgba(110,90,255,0.12)");
          halo.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = halo;
          ctx.fillRect(0, 0, size, size);

          projection.rotate([rot[0], rot[1], 0]);
          const ocean = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.1, c, c, r);
          ocean.addColorStop(0, "#14295a");
          ocean.addColorStop(1, "#050b1c");
          ctx.beginPath();
          path({ type: "Sphere" });
          ctx.fillStyle = ocean;
          ctx.fill();

          ctx.beginPath();
          path(graticule);
          ctx.strokeStyle = "rgba(140,170,255,0.08)";
          ctx.lineWidth = 0.6;
          ctx.stroke();

          ctx.beginPath();
          for (const f of countries) path(f as Feature);
          ctx.fillStyle = "#18233f";
          ctx.fill();
          ctx.strokeStyle = "rgba(150,180,255,0.16)";
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.save();
          ctx.shadowColor = "rgba(251,191,36,0.9)";
          ctx.shadowBlur = 18;
          ctx.beginPath();
          for (const f of lit) path(f as Feature);
          ctx.fillStyle = "#fbbf24";
          ctx.fill();
          ctx.restore();

          // Labels, only when the country faces us.
          const center: [number, number] = [-rot[0], -rot[1]];
          ctx.font = `600 13px ${fontFamily}`;
          ctx.textAlign = "left";
          for (const f of lit) {
            const centroid = d3.geoCentroid(f as Feature);
            if (d3.geoDistance(centroid, center) > 1.3) continue;
            const p = projection(centroid);
            if (!p) continue;
            const dx = LIT[String(f.id)] === "Italy" ? -70 : 26;
            ctx.strokeStyle = "rgba(253,230,138,0.6)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(p[0] + dx * 0.55, p[1] - 22);
            ctx.stroke();
            ctx.fillStyle = "#fde68a";
            ctx.fillText(LIT[String(f.id)] ?? "", p[0] + dx * (dx > 0 ? 0.6 : 1.05), p[1] - 26);
          }

          // Terminator shading: the globe is on the night side, lit from the upper left.
          const shade = ctx.createLinearGradient(c - r, c - r, c + r, c + r);
          shade.addColorStop(0, "rgba(0,0,0,0)");
          shade.addColorStop(1, "rgba(2,4,12,0.55)");
          ctx.beginPath();
          path({ type: "Sphere" });
          ctx.fillStyle = shade;
          ctx.fill();
        };

        const tick = (t: number) => {
          if (!dragging) {
            const target0 = HOME[0] + Math.sin(t / 5200) * 9;
            rot[0] += (target0 - rot[0]) * 0.02;
            rot[1] += (HOME[1] - rot[1]) * 0.02;
          }
          draw();
          if (visible && !document.hidden) raf = requestAnimationFrame(tick);
        };

        const startLoop = () => {
          cancelAnimationFrame(raf);
          if (reduce) draw();
          else raf = requestAnimationFrame(tick);
        };

        const onDown = (e: PointerEvent) => {
          dragging = true;
          last = [e.clientX, e.clientY];
          cv.setPointerCapture(e.pointerId);
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging || !last) return;
          rot[0] += (e.clientX - last[0]) * 0.35;
          rot[1] = Math.max(-80, Math.min(80, rot[1] - (e.clientY - last[1]) * 0.35));
          last = [e.clientX, e.clientY];
          if (reduce) draw();
        };
        const onUp = () => {
          dragging = false;
          last = null;
        };
        const onKey = (e: KeyboardEvent) => {
          const step = 10;
          const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
          const m = moves[e.key];
          if (!m) return;
          e.preventDefault();
          rot[0] += m[0];
          rot[1] = Math.max(-80, Math.min(80, rot[1] + m[1]));
          if (reduce) draw();
        };

        if (reduce) {
          rot[0] = HOME[0];
          rot[1] = HOME[1];
        }
        resize();
        startLoop();
        setReady(true);

        const io = new IntersectionObserver(([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          if (visible) startLoop();
        });
        io.observe(cv);
        const onResize = () => {
          resize();
          draw();
        };
        const onVisibility = () => !document.hidden && visible && startLoop();
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVisibility);
        cv.addEventListener("pointerdown", onDown);
        cv.addEventListener("pointermove", onMove);
        cv.addEventListener("pointerup", onUp);
        cv.addEventListener("pointercancel", onUp);
        cv.addEventListener("keydown", onKey);
        cleanup = () => {
          io.disconnect();
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibility);
          cv.removeEventListener("pointerdown", onDown);
          cv.removeEventListener("pointermove", onMove);
          cv.removeEventListener("pointerup", onUp);
          cv.removeEventListener("pointercancel", onUp);
          cv.removeEventListener("keydown", onKey);
        };
      } catch (err) {
        console.error("NightGlobe: could not load map data", err);
        if (!disposed) setError(true);
      }
    };

    // Load the map only when the globe is about to be seen.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          near.disconnect();
          void start();
        }
      },
      { rootMargin: "400px" },
    );
    near.observe(el);

    return () => {
      disposed = true;
      near.disconnect();
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[34rem]">
      {!ready && (
        <div
          className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#14295a,#050b1c)] shadow-[0_0_80px_10px_rgba(90,140,255,0.25)]"
          aria-hidden="true"
        />
      )}
      <canvas
        ref={canvas}
        tabIndex={0}
        role="img"
        aria-label="A globe at night centered on the Mediterranean, with Greece and Italy glowing. Drag or use the arrow keys to spin it."
        className={`relative block h-full w-full cursor-grab touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue active:cursor-grabbing ${ready ? "" : "opacity-0"}`}
      />
      {error && <p className="absolute inset-x-0 bottom-0 text-center text-sm text-soft">The map didn’t load. Reload to try again.</p>}
    </div>
  );
}
