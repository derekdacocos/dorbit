// Little 4-point stars that glitter (pop in and fade out) at random spots and times.

// A "random" number generator that always gives the same numbers in the same order,
// so the server and the browser draw the sparkles in the same places.
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const random = seededRandom(42);

const SPARKLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: random() * 100, // % from the left
  top: random() * 100, // % from the top
  size: 6 + random() * 10, // px
  delay: random() * 8, // seconds before its first glitter
  duration: 4 + random() * 5, // seconds between glitters
}));

export default function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {SPARKLES.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}