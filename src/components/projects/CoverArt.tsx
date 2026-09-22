interface CoverArtProps {
  /** Anything stable per project; the same seed always draws the same art. */
  seed: string;
  /** Printed in the corner, like the label on a tape spine. */
  label: string;
}

const WIDTH = 320;
const HEIGHT = 200;
const BAR_COUNT = 40;

// FNV-1a: a small, well-spread string hash, enough to seed the generator.
function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

// mulberry32: deterministic, so server and client render identical art.
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function spectrumBars(random: () => number) {
  const peaks = Array.from({ length: 3 }, () => ({
    centre: random(),
    width: 0.06 + random() * 0.12,
    height: 0.35 + random() * 0.5,
  }));
  const barWidth = WIDTH / BAR_COUNT;

  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const position = index / (BAR_COUNT - 1);
    let energy = 0.08 + random() * 0.06;
    for (const peak of peaks) {
      const distance = position - peak.centre;
      energy +=
        peak.height * Math.exp(-(distance * distance) / (2 * peak.width ** 2));
    }
    const barHeight = Math.min(0.92, energy) * HEIGHT * 0.72;
    return {
      x: index * barWidth + barWidth * 0.2,
      y: HEIGHT * 0.86 - barHeight,
      width: barWidth * 0.6,
      height: barHeight,
    };
  });
}

function oscilloscopePath(random: () => number): string {
  const partials = Array.from({ length: 3 }, (_, index) => ({
    frequency: (index + 1) * (1.5 + random() * 2.5),
    amplitude: (0.5 / (index + 1)) * (0.6 + random() * 0.6),
    phase: random() * Math.PI * 2,
  }));
  const points: string[] = [];

  for (let step = 0; step <= 160; step += 1) {
    const t = step / 160;
    const envelope = Math.sin(t * Math.PI) ** 0.6;
    let value = 0;
    for (const partial of partials) {
      value +=
        partial.amplitude *
        Math.sin(t * Math.PI * 2 * partial.frequency + partial.phase);
    }
    const y = HEIGHT / 2 - value * envelope * HEIGHT * 0.32;
    points.push(`${(t * WIDTH).toFixed(1)},${y.toFixed(1)}`);
  }

  return `M${points.join("L")}`;
}

/**
 * Generated cover for a project with no screenshot: a spectrum or scope trace
 * in the site's instrument style, so an empty slot still looks deliberate.
 */
export default function CoverArt({ seed, label }: CoverArtProps) {
  const seedValue = hash(seed);
  const random = createRandom(seedValue);
  const tracePath = seedValue % 2 === 1 ? oscilloscopePath(random) : null;
  const gradientId = `cover-${seedValue.toString(36)}`;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-ink-850"
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#00b399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {tracePath ? (
          <>
            {/* The same trace twice: a wide faint stroke as phosphor glow
                under the sharp one. */}
            <path
              d={tracePath}
              fill="none"
              stroke="#00ffcc"
              strokeOpacity="0.25"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={tracePath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          spectrumBars(random).map((bar, index) => (
            <rect
              key={index}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              rx={bar.width / 2}
              fill={`url(#${gradientId})`}
            />
          ))
        )}
      </svg>
      <span className="eyebrow absolute bottom-3 left-4 max-w-[80%] truncate text-brand/70">
        {label}
      </span>
    </div>
  );
}
