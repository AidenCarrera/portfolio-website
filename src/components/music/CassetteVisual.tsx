interface CassetteVisualProps {
  title: string;
  variant: "shelf" | "deck";
  /** Deck only: whether the reels are turning. */
  playing?: boolean;
}

// Guide holes either side, capstan holes between, in container units.
const HOLE_SIZES = ["4.5cqw", "3cqw", "3cqw", "4.5cqw"] as const;

// Six drive teeth around the hub's spindle hole.
const TEETH = Array.from({ length: 6 }, (_, index) => index * 60);

function Reel({
  packScale,
  spinClass,
}: {
  /** How much tape is wound on this side, as a fraction of the window. */
  packScale: number;
  spinClass: string;
}) {
  return (
    <div className="relative flex aspect-square h-full items-center justify-center">
      {/* The wound tape pack. */}
      <div
        className="absolute rounded-full bg-[radial-gradient(circle,#202226_0%,#121316_70%,#0b0c0e_100%)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.4)]"
        style={{ width: `${packScale * 100}%`, height: `${packScale * 100}%` }}
      />
      <div className={`relative size-[46%] ${spinClass}`}>
        <svg viewBox="0 0 40 40" className="size-full" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill="#e8edf2" />
          <circle
            cx="20"
            cy="20"
            r="19"
            fill="none"
            stroke="#9aa6b5"
            strokeWidth="1"
          />
          <circle cx="20" cy="20" r="8" fill="#0b1018" />
          {TEETH.map((angle) => (
            <rect
              key={angle}
              x="18.5"
              y="11"
              width="3"
              height="4"
              rx="0.6"
              fill="#e8edf2"
              transform={`rotate(${angle} 20 20)`}
            />
          ))}
          {/* Three window slots, so the turn is visible. */}
          {[0, 120, 240].map((angle) => (
            <rect
              key={angle}
              x="17"
              y="1.8"
              width="6"
              height="6.5"
              rx="2"
              fill="#b8c2cf"
              transform={`rotate(${angle} 20 20)`}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/**
 * A compact cassette drawn in proportion: every dimension is a percentage and
 * the type is sized in container units, so one drawing serves the shelf and
 * the deck at any width.
 */
export default function CassetteVisual({
  title,
  variant,
  playing = false,
}: CassetteVisualProps) {
  const isDeck = variant === "deck";
  // Shelf tapes turn on hover. The deck's reels run one endless animation
  // that is only ever paused, so they stop where they are and pick up from
  // the same angle, whatever the audio does underneath: a tape swap included.
  const reelSpin = isDeck
    ? `animate-[spin_1s_linear_infinite] motion-reduce:animate-none ${
        playing ? "" : "[animation-play-state:paused]"
      }`
    : "group-hover:animate-[spin_2.4s_linear_infinite] motion-reduce:group-hover:animate-none";

  return (
    <div
      className={`@container ${
        isDeck ? "relative aspect-[1.58] w-full max-w-md" : "absolute inset-0"
      }`}
    >
      {/* Shell */}
      <div className="absolute inset-0 overflow-hidden rounded-[5%/8%] border border-white/10 bg-linear-to-b from-[#1c2636] via-[#172030] to-[#131b27] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),inset_0_-2px_6px_rgb(0_0_0/0.4),0_24px_40px_-24px_rgb(0_0_0/0.9)]">
        {/* Paper label, with the tape window cut through it. */}
        <div className="absolute inset-x-[7%] top-[7%] h-[62%] overflow-hidden rounded-[3%/5%] bg-[#eef1f4] bg-[repeating-linear-gradient(to_bottom,transparent_0_10%,rgb(15_23_42/0.08)_10%_11%)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]">
          <div className="absolute inset-x-0 top-0 h-[17%] bg-brand" />
          <div className="absolute inset-x-0 top-[17%] h-[3%] bg-ink-900/80" />
          <span className="absolute top-[3%] left-[3%] font-mono text-[4.2cqw] leading-none font-bold text-ink-950">
            A
          </span>
          <p className="absolute inset-x-[10%] top-[25%] truncate text-center font-mono text-[5.4cqw] leading-tight font-bold tracking-tight text-ink-950 uppercase">
            {title}
          </p>

          <div className="absolute inset-x-[17%] bottom-[9%] flex h-[44%] items-center justify-between rounded-full bg-[#070a0f] px-[3%] shadow-[inset_0_2px_6px_rgb(0_0_0/0.8)]">
            <Reel packScale={0.72} spinClass={reelSpin} />
            {/* The tape itself, crossing the window between the packs. */}
            <div className="mx-[2%] h-[16%] flex-1 rounded-[1px] bg-[#141518]" />
            <Reel packScale={0.72} spinClass={reelSpin} />
          </div>
        </div>

        {/* Bottom tab with the capstan and guide holes. */}
        <div className="absolute inset-x-[19%] bottom-0 flex h-[20%] items-center justify-around border-t border-white/10 bg-[#121a26] px-[8%] [clip-path:polygon(6%_0,94%_0,100%_100%,0_100%)]">
          {HOLE_SIZES.map((size, hole) => (
            <span
              key={hole}
              className="rounded-full bg-[#05080c] shadow-[inset_0_1px_2px_rgb(0_0_0/0.9)]"
              style={{ width: size, height: size }}
            />
          ))}
        </div>

        {/* Moulded sheen on the plastic. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/[0.04] via-transparent to-transparent" />
      </div>
    </div>
  );
}
