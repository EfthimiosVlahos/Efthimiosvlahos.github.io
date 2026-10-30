"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Marks its child area `is-visible` the first time it scrolls into view, which starts the draw animation. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`draw-on ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
