"use client";

import { useState } from "react";
import type { MapMarker, MapShape } from "@/lib/geo";

/**
 * Renders pre-computed map paths. Visited places are focusable so keyboard users get the same
 * labels as hover; unvisited places are quiet background.
 */
export function TravelMap({
  title,
  width,
  height,
  shapes,
  markers = [],
}: {
  title: string;
  width: number;
  height: number;
  shapes: MapShape[];
  markers?: MapMarker[];
}) {
  const [label, setLabel] = useState<{ name: string; x: number; y: number } | null>(null);
  const show = (name: string) => (e: { currentTarget: SVGGraphicsElement }) => {
    const box = e.currentTarget.getBBox();
    setLabel({ name, x: box.x + box.width / 2, y: box.y });
  };

  return (
    <div className="relative" onMouseLeave={() => setLabel(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={title} className="block h-auto w-full">
        {shapes
          .filter((s) => !s.visited)
          .map((s) => (
            <path key={s.id} d={s.d} fill="var(--paper-sunken)" stroke="var(--rule)" strokeWidth={0.6} aria-hidden="true" />
          ))}
        {shapes
          .filter((s) => s.visited)
          .map((s) => (
            <path
              key={s.id}
              d={s.d}
              tabIndex={0}
              role="img"
              aria-label={s.name}
              onMouseEnter={show(s.name)}
              onFocus={show(s.name)}
              onBlur={() => setLabel(null)}
              className="cursor-default outline-none transition-[fill] hover:fill-[var(--violet)] focus-visible:fill-[var(--violet)]"
              fill="var(--blue-strong)"
              stroke="var(--paper)"
              strokeWidth={0.8}
            />
          ))}
        {markers.map((m) => (
          <g key={m.id}>
            <circle cx={m.x} cy={m.y} r={9} fill="var(--blue-strong)" opacity={0.25} aria-hidden="true" />
            <circle
              cx={m.x}
              cy={m.y}
              r={4}
              tabIndex={0}
              role="img"
              aria-label={m.name}
              onMouseEnter={show(m.name)}
              onFocus={show(m.name)}
              onBlur={() => setLabel(null)}
              fill="var(--blue-strong)"
              stroke="var(--paper)"
              strokeWidth={1.5}
              className="outline-none"
            />
          </g>
        ))}
      </svg>
      {label && (
        <div className="chart-tip" style={{ left: `${(label.x / width) * 100}%`, top: `${(label.y / height) * 100}%` }} role="status">
          {label.name}
        </div>
      )}
    </div>
  );
}
