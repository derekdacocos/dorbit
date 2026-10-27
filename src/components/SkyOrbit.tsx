"use client";
 
import { useSyncExternalStore } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";
 
function subscribe(onChange: () => void) {
  const intervalId = setInterval(onChange, 60 * 1000);
  return () => clearInterval(intervalId);
}
 
// Minutes since midnight, e.g. 2:30 PM = 870 (null while the server renders). Updates every minute.
function useMinutes() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
    },
    () => null
  );
}
 
// The orbit is a tilted oval around the clock. All numbers are % of the screen.
const CENTER_X = 50;
const CENTER_Y = 22;
const RADIUS_X = 46;
const RADIUS_Y = 12;
const TILT = (-6 * Math.PI) / 180;
 
// A point on the orbit for an angle in degrees (180 = left, 270 = top, 360 = right)
function orbitPoint(degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  const x = RADIUS_X * Math.cos(angle);
  const y = RADIUS_Y * Math.sin(angle);
  return {
    x: CENTER_X + x * Math.cos(TILT) - y * Math.sin(TILT),
    y: CENTER_Y + x * Math.sin(TILT) + y * Math.cos(TILT),
  };
}
 
// SVG path along the orbit from one angle to another
function arcPath(fromDegrees: number, toDegrees: number) {
  const steps = 60;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const { x, y } = orbitPoint(fromDegrees + ((toDegrees - fromDegrees) * i) / steps);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
}
 
const FULL_ORBIT = arcPath(0, 360);
 
// Moonlight (dark) or Sunrise (light): a moon or sun that travels around the orbit once a day.
// 6 AM = left, noon = top, 6 PM = right, then it goes around the back during the night.
export default function SkyOrbit() {
  const theme = useSettingsStore((state) => state.theme);
  const minutes = useMinutes();
  if (minutes === null) return null;
 
  const progress = ((minutes - 6 * 60 + 24 * 60) % (24 * 60)) / (24 * 60);
  const degrees = 180 + progress * 360;
  const { x, y } = orbitPoint(degrees);
 
  // Bigger and brighter on the top (front) of the orbit, smaller and dimmer around the back
  const front = (1 - Math.sin((degrees * Math.PI) / 180)) / 2; // 1 at the top, 0 at the bottom
  const scale = 0.6 + front * 0.4;
  const opacity = 0.45 + front * 0.55;
 
  const isDark = theme === "dark";
  const trailColor = isDark ? "#a5b4fc" : "#f5b971";
 
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* The whole orbit, very faint */}
        <path
          d={FULL_ORBIT}
          fill="none"
          stroke={trailColor}
          strokeOpacity={isDark ? 0.18 : 0.35}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* A glowing light trail behind the moon/sun, brighter closer to it */}
        {[
          { length: 70, opacity: 0.25 },
          { length: 35, opacity: 0.5 },
          { length: 12, opacity: 0.9 },
        ].map((trail) => (
          <path
            key={trail.length}
            d={arcPath(degrees - trail.length, degrees)}
            fill="none"
            stroke={trailColor}
            strokeOpacity={trail.opacity}
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: `drop-shadow(0 0 3px ${trailColor})` }}
          />
        ))}
      </svg>
 
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          opacity,
          transform: `translate(-50%, -50%) scale(${scale})`,
          // Glide smoothly to the next spot over the minute, instead of jumping
          transition: "left 60s linear, top 60s linear, transform 60s linear, opacity 60s linear",
        }}
      >
        {/* float = a gentle up-and-down bob, so it's never completely still */}
        <div className="float">
          <div className={isDark ? "moon" : "sun"} />
        </div>
      </div>
    </div>
  );
}
 