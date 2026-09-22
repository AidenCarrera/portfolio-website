import type { MusicSnippet } from "@/types";
import { Play, Pause, Square } from "lucide-react";
import { useTapePlayer } from "@/hooks/useTapePlayer";
import CassetteVisual from "./CassetteVisual";

interface CassetteDeckProps {
  activeSnippet: MusicSnippet | null;
}

// Vertical travel needed to sweep the knob across its full range.
const VOLUME_DRAG_RANGE_PX = 480;
const VOLUME_WHEEL_STEP = 0.02;
// Applied while Shift is held, for fine adjustment.
const VOLUME_FINE_FACTOR = 0.2;
const KNOB_TICKS = 11;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const formatTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Hardware transport key: a raised cap that sinks when pressed.
const KEY_CLASS =
  "flex items-center justify-center rounded-xl border transition-[transform,box-shadow,background-color,filter] duration-150 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-40";

export default function CassetteDeck({ activeSnippet }: CassetteDeckProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    audioRef,
    togglePlay,
    stop,
    seek,
    handleTimeUpdate,
    handleLoadedMetadata,
    syncPlayState,
  } = useTapePlayer(activeSnippet);

  const knobRotation = volume * 270 - 135;
  const progress = (currentTime / (duration || 1)) * 100;

  const handleKnobPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    // Accumulating per move rather than from a fixed anchor lets Shift be
    // pressed or released mid-drag without the knob jumping.
    let lastY = e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const travel = (lastY - moveEvent.clientY) / VOLUME_DRAG_RANGE_PX;
      lastY = moveEvent.clientY;
      const step = moveEvent.shiftKey ? travel * VOLUME_FINE_FACTOR : travel;
      setVolume((prev) => clampVolume(prev + step));
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        target.releasePointerCapture(upEvent.pointerId);
      } catch {
        // pointer capture already released
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleKnobWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Holding Shift makes browsers report the scroll on deltaX instead.
    const scroll = e.deltaY !== 0 ? e.deltaY : e.deltaX;
    if (scroll === 0) return;

    const step = e.shiftKey
      ? VOLUME_WHEEL_STEP * VOLUME_FINE_FACTOR
      : VOLUME_WHEEL_STEP;
    setVolume((prev) => clampVolume(prev + (scroll > 0 ? -step : step)));
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Chassis: a brushed top plate around a recessed deck. */}
      <div className="relative rounded-[2rem] border border-line bg-linear-to-b from-[#1a2432] to-ink-850 p-1.5 shadow-[0_60px_120px_-50px_rgb(0_0_0/0.95),inset_0_1px_0_rgb(255_255_255/0.08)]">
        <div className="relative rounded-[1.65rem] bg-ink-900/85 p-4 shadow-[inset_0_2px_12px_rgb(0_0_0/0.5)] sm:p-7">
          <p className="mb-6 text-sm font-bold tracking-[0.2em] text-brand uppercase">
            Tape Player
          </p>

          {/* Tape well, behind smoked glass. */}
          <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-2xl border border-black/50 bg-[radial-gradient(ellipse_at_50%_30%,var(--color-ink-700),var(--color-ink-850)_90%)] p-5 shadow-[inset_0_4px_24px_rgb(0_0_0/0.6)] sm:h-72 sm:p-8">
            {activeSnippet ? (
              <CassetteVisual
                title={activeSnippet.title}
                variant="deck"
                playing={isPlaying}
              />
            ) : (
              <p className="eyebrow text-muted">No Cassette Loaded</p>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.04),transparent_60%)]"
            />
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Scrub bar: a styled track over a transparent native range, so
                keyboard and assistive tech get a real slider. */}
            <div className="flex flex-1 items-center gap-3 font-mono text-xs text-slate-400 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <div
                className={`group relative h-2 flex-1 rounded-full bg-white/[0.07] shadow-[inset_0_1px_2px_rgb(0_0_0/0.6)] focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-ink-900 ${
                  activeSnippet ? "cursor-pointer" : ""
                }`}
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-brand-dark to-brand shadow-[0_0_12px_rgb(0_255_204/0.6)]"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white shadow-lg transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0"
                  style={{ left: `${progress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={(event) => seek(Number(event.currentTarget.value))}
                  disabled={!activeSnippet || duration <= 0}
                  aria-label="Playback position"
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 focus:outline-none disabled:cursor-default"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between gap-5 sm:justify-end">
              <div className="flex flex-col items-center">
                <span className="eyebrow mb-1.5 text-muted">Vol</span>
                <div
                  onPointerDown={handleKnobPointerDown}
                  onWheel={handleKnobWheel}
                  className="group relative flex size-14 cursor-ns-resize items-center justify-center rounded-full select-none focus-within:ring-2 focus-within:ring-brand"
                >
                  {Array.from({ length: KNOB_TICKS }).map((_, i) => (
                    <div
                      key={i}
                      aria-hidden="true"
                      className={`absolute h-1.5 w-0.5 origin-bottom rounded-full ${
                        i / (KNOB_TICKS - 1) <= volume
                          ? "bg-brand shadow-[0_0_6px_var(--color-brand)]"
                          : "bg-slate-600"
                      }`}
                      style={{
                        transform: `rotate(${-135 + i * 27}deg) translateY(-22px)`,
                      }}
                    />
                  ))}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none relative size-10 rounded-full border border-black/60 bg-[conic-gradient(from_0deg,#cfd6df,#8a95a5,#e3e8ee,#7d8898,#cfd6df,#8a95a5,#e3e8ee,#7d8898,#cfd6df)] shadow-[0_6px_14px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.6)] transition-[filter] duration-75 group-hover:brightness-110"
                    style={{ transform: `rotate(${knobRotation}deg)` }}
                  >
                    <div className="absolute top-1 left-1/2 h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-ink-900" />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(event) =>
                      setVolume(Number(event.currentTarget.value))
                    }
                    aria-label="Volume"
                    aria-valuetext={`${Math.round(volume * 100)}%`}
                    className="pointer-events-none absolute inset-0 z-10 h-full w-full cursor-ns-resize opacity-0 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={stop}
                  disabled={!activeSnippet}
                  aria-label="Stop playback"
                  className={`${KEY_CLASS} size-14 border-black/50 bg-linear-to-b from-[#2a3546] to-[#1a2330] text-slate-300 shadow-[0_4px_0_#0b1018,inset_0_1px_0_rgb(255_255_255/0.1)] hover:brightness-110 active:shadow-[0_1px_0_#0b1018,inset_0_1px_0_rgb(255_255_255/0.1)]`}
                >
                  <Square size={16} fill="currentColor" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!activeSnippet}
                  aria-label={isPlaying ? "Pause playback" : "Start playback"}
                  className={`${KEY_CLASS} h-14 w-20 border-brand-darker bg-linear-to-b from-[#5dffe0] to-brand text-ink-950 shadow-[0_4px_0_#008a6b,0_0_28px_-6px_rgb(0_255_204/0.7),inset_0_1px_0_rgb(255_255_255/0.5)] hover:brightness-105 active:shadow-[0_1px_0_#008a6b,inset_0_1px_0_rgb(255_255_255/0.5)]`}
                >
                  {isPlaying ? (
                    <Pause size={20} fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Play size={20} fill="currentColor" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={syncPlayState}
        onPause={syncPlayState}
        onEnded={syncPlayState}
        className="hidden"
      />
    </div>
  );
}
