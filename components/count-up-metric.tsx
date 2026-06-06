"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseMetric(value: string) {
  const match = value.match(/^([^0-9-]*)([0-9.,]+)(.*)$/);
  if (!match) return null;
  const [, prefix, rawNumber, suffix] = match;
  const numeric = Number(rawNumber.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  return { prefix, numeric, suffix };
}

export function CountUpMetric({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const parsed = useMemo(() => parseMetric(value), [value]);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!parsed || !ref.current) return;
    const node = ref.current;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(parsed.numeric * eased);
          setDisplay(`${parsed.prefix}${current.toLocaleString("en-US")}${parsed.suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [parsed]);

  return <strong ref={ref}>{display}</strong>;
}
