"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";

/** ISO 3166 numeric ids in world-atlas: lit like city lights. */
const LIT: Record<string, string> = { "300": "Greece", "380": "Italy" };
const GREECE: [number, number] = [22.6, 39.3];
const LONG_ISLAND: [number, number] = [-73.1, 40.8];

/** Views, as d3 rotations [−longitude, −latitude] of the point at the center. */
const VIEWS = {
  both: [25, -38],
  greece: [-20, -39],
  longIsland: [73, -40],
} as const;
type View = keyof typeof VIEWS;

/**
 * A night-side globe with Greek roots and a Long Island home joined by a glowing arc. Italy glows too.
 * Drag or use the arrow keys to spin it; the buttons fly between the two ends. Map data loads only
 * when the globe nears the viewport.
 */
export function NightGlobe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef<View>("both");
  const [current, setCurrent] = useState<View>("both");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const fly = (v: View) => {
    view.current = v;
    setCurrent(v);
  };

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
        const arc = { type: "LineString" as const, coordinates: [GREECE, LONG_ISLAND] };
        const along = d3.geoInterpolate(GREECE, LONG_ISLAND);
        // Canvas can't read CSS variables, so resolve the site font's real family name once.
        const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-inter").trim() || "system-ui, sans-serif";
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

        let size = 0;
        const rot: [number, number] = reduce ? [VIEWS.both[0], VIEWS.both[1]] : [VIEWS.both[0] + 60, VIEWS.both[1] + 10];
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

        const label = (pt: [number, number], text: string, dx: number, dy: number) => {
          const center: [number, number] = [-rot[0], -rot[1]];
          if (d3.geoDistance(pt, center) > 1.35) return;
          const p = projection(pt);
          if (!p) return;
          ctx.strokeStyle = "rgba(253,230,138,0.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(p[0] + dx, p[1] + dy);
          ctx.stroke();
          ctx.fillStyle = "#fde68a";
          ctx.textAlign = dx < 0 ? "right" : "left";
          ctx.fillText(text, p[0] + dx + (dx < 0 ? -4 : 4), p[1] + dy + 4);
        };

        const draw = (t: number) => {
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

          // The arc home: dashed, with a light traveling from Greece to Long Island.
          ctx.save();
          ctx.setLineDash([5, 7]);
          ctx.lineDashOffset = reduce ? 0 : -t / 40;
          ctx.strokeStyle = "rgba(253,230,138,0.75)";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          path(arc);
          ctx.stroke();
          ctx.restore();
          if (!reduce) {
            const pos = along(((t / 7000) % 1) as number);
            if (d3.geoDistance(pos, [-rot[0], -rot[1]]) < Math.PI / 2) {
              const p = projection(pos);
              if (p) {
                const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 10);
                g.addColorStop(0, "rgba(255,244,214,1)");
                g.addColorStop(1, "rgba(255,244,214,0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // Long Island: a glowing point.
          if (d3.geoDistance(LONG_ISLAND, [-rot[0], -rot[1]]) < Math.PI / 2) {
            const p = projection(LONG_ISLAND);
            if (p) {
              const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 12);
              g.addColorStop(0, "rgba(255,236,170,1)");
              g.addColorStop(0.4, "rgba(251,191,36,0.6)");
              g.addColorStop(1, "rgba(251,191,36,0)");
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.arc(p[0], p[1], 12, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.font = `600 13px ${fontFamily}`;
          label(GREECE, "Greece", 26, -26);
          const italy = lit.find((f) => LIT[String(f.id)] === "Italy");
          if (italy) label(d3.geoCentroid(italy as Feature) as [number, number], "Italy", -22, -30);
          label(LONG_ISLAND, "Long Island", -26, -26);

          // Night-side shading, lit from the upper left.
          const shade = ctx.createLinearGradient(c - r, c - r, c + r, c + r);
          shade.addColorStop(0, "rgba(0,0,0,0)");
          shade.addColorStop(1, "rgba(2,4,12,0.5)");
          ctx.beginPath();
          path({ type: "Sphere" });
          ctx.fillStyle = shade;
          ctx.fill();
        };

        const tick = (t: number) => {
          if (!dragging) {
            const target = VIEWS[view.current];
            const sway = view.current === "both" ? Math.sin(t / 5200) * 7 : 0;
            rot[0] += (target[0] + sway - rot[0]) * 0.03;
            rot[1] += (target[1] - rot[1]) * 0.03;
          }
          draw(t);
          if (visible && !document.hidden) raf = requestAnimationFrame(tick);
        };

        const startLoop = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
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
        };
        const onUp = () => {
          dragging = false;
          last = null;
        };
        const onKey = (e: KeyboardEvent) => {
          const moves: Record<string, [number, number]> = { ArrowLeft: [10, 0], ArrowRight: [-10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
          const m = moves[e.key];
          if (!m) return;
          e.preventDefault();
          dragging = true;
          rot[0] += m[0];
          rot[1] = Math.max(-80, Math.min(80, rot[1] + m[1]));
          window.setTimeout(() => (dragging = false), 1200);
        };

        resize();
        // Reduced motion still animates user-initiated flights, but nothing moves on its own.
        if (reduce) draw(0);
        startLoop();
        setReady(true);

        const io = new IntersectionObserver(([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          if (visible) startLoop();
        });
        io.observe(cv);
        const onResize = () => resize();
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

  const buttons: { id: View; label: string }[] = [
    { id: "greece", label: "Greece" },
    { id: "both", label: "The whole arc" },
    { id: "longIsland", label: "Long Island" },
  ];

  return (
    <div>
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
          aria-label="A globe at night with Greece and Italy glowing and an arc from Greece to Long Island, New York. Drag or use the arrow keys to spin it."
          className={`relative block h-full w-full cursor-grab touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue active:cursor-grabbing ${ready ? "" : "opacity-0"}`}
        />
        {error && <p className="absolute inset-x-0 bottom-0 text-center text-sm text-soft">The map didn’t load. Reload to try again.</p>}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Fly the globe to">
        {buttons.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={current === b.id}
            onClick={() => fly(b.id)}
            className="toggle"
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
