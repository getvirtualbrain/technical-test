import { useEffect, useRef } from "react";

type LifeBarProps = {
  current: number;
  max: number;
  height?: number;
  showNumbers?: boolean;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const getColor = (ratio: number) => {
  if (ratio >= 0.5) {
    const g = 200 + Math.round((ratio - 0.5) * 55);
    const r = Math.round(255 - (ratio - 0.5) * 150);
    return `rgb(${r}, ${g}, 120)`;
  } else if (ratio >= 0.2) {
    const r = 255;
    const g = Math.round(200 - (0.5 - ratio) * 100);
    return `rgb(${r}, ${g}, 100)`;
  } else {
    const r = 255;
    const g = Math.round(100 - (0.2 - ratio) * 100);
    return `rgb(${r}, ${Math.max(0, g)}, 100)`;
  }
};

export default function LifeBar({
  current,
  max,
  height = 12,
  showNumbers = true,
}: LifeBarProps) {
  const ratio = max > 0 ? clamp(current / max, 0, 1) : 0;
  const percentage = Math.round(ratio * 100);

  const trailRef = useRef<number>(ratio);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (ratio >= trailRef.current) {
      trailRef.current = ratio;
      return;
    }

    const start = trailRef.current;
    const duration = 400;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = clamp(elapsed / duration, 0, 1);

      trailRef.current = start + (ratio - start) * t;
      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        trailRef.current = ratio;
      }
    };

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [ratio]);

  const barColor = getColor(ratio);
  const trailRatio = clamp(trailRef.current, 0, 1);

  return (
    <div style={{ width: "100%" }}>
      <div
        aria-label="Life bar"
        style={{
          position: "relative",
          backgroundColor: "#e2e8f0",
          borderRadius: 999,
          overflow: "hidden",
          height,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${Math.round(trailRatio * 100)}%`,
            backgroundColor: "#cbd5e1",
            transition: "width 0.3s ease-out",
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            width: `${Math.round(percentage)}%`,
            backgroundColor: barColor,
            transition: "width 0.3s ease-out, background-color 0.3s",
          }}
        />
      </div>
      {showNumbers && (
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            display: "flex",
            justifyContent: "space-between",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          <div>
            {current} / {max}
          </div>
          <div>{percentage}%</div>
        </div>
      )}
    </div>
  );
}
