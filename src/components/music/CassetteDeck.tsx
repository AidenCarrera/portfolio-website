import type { MusicSnippet } from "@/types";
import { Play, Pause, Square } from "lucide-react";
import { useTapePlayer } from "@/hooks/useTapePlayer";
import CassetteVisual from "./CassetteVisual";

interface CassetteDeckProps {
  activeSnippet: MusicSnippet | null;
}

export default function CassetteDeck({ activeSnippet }: CassetteDeckProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    audioRef,
    controls,
    togglePlay,
    stop,
    seek,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  } = useTapePlayer(activeSnippet);

  const knobRotation = volume * 270 - 135;
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="bg-slate-800 rounded-3xl p-1 shadow-2xl border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none rounded-3xl" />

        <div className="bg-slate-900 rounded-[1.4rem] p-6 sm:p-8 relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${activeSnippet ? "bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-red-900"}`}
              />
              <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
                Power On
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-brand font-bold uppercase tracking-widest text-sm">
                Tape Player
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                STEREO CASSETTE DECK
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 mb-8 border-4 border-slate-700 shadow-inner relative overflow-hidden h-72 flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20" />
            {activeSnippet ? (
              <CassetteVisual
                title={activeSnippet.title}
                variant="deck"
                reelAnimation={controls}
              />
            ) : (
              <div className="text-slate-600 font-mono text-sm uppercase tracking-widest">
                No Cassette Loaded
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600 shadow-inner font-mono relative overflow-hidden">
              <div className="flex justify-between items-center text-brand mb-2">
                <div className="text-xs tracking-widest uppercase">
                  Playback
                </div>
                <div className="text-lg font-bold tracking-wider">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div
                className={`w-full bg-slate-800 h-2 rounded-full relative group focus-within:ring-2 focus-within:ring-brand ${activeSnippet ? "cursor-pointer" : ""}`}
              >
                <div
                  className="h-full bg-brand shadow-[0_0_10px_rgba(51,230,204,0.8)] relative"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]" />
                </div>
                <div
                  className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-brand -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100"
                  style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
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
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
                />
              </div>
            </div>

            <div className="flex justify-end items-end space-x-6">
              <div className="flex flex-col items-center mr-4">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
                  Vol
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center cursor-ns-resize group focus-within:ring-2 focus-within:ring-brand rounded-full">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-1.5 bg-slate-600 origin-bottom"
                      style={{
                        transform: `rotate(${-135 + i * 27}deg) translateY(-18px)`,
                        opacity: 0.3 + (i / 10) * 0.7,
                      }}
                    />
                  ))}
                  <div
                    className="w-9 h-9 rounded-full bg-linear-to-br from-slate-300 to-slate-500 shadow-lg border border-slate-600 relative transition-transform duration-75 ease-out group-hover:brightness-110 pointer-events-none"
                    style={{ transform: `rotate(${knobRotation}deg)` }}
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-slate-800 rounded-full" />
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
                    className="absolute inset-0 z-10 h-full w-full cursor-ns-resize opacity-0 [direction:rtl] [writing-mode:vertical-lr]"
                  />
                </div>
              </div>

              <button
                onClick={stop}
                disabled={!activeSnippet}
                aria-label="Stop playback"
                className="w-12 h-12 rounded bg-slate-700 shadow-md active:translate-y-1 transition-all flex items-center justify-center text-slate-300 hover:bg-slate-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <Square size={16} fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                disabled={!activeSnippet}
                aria-label={isPlaying ? "Pause playback" : "Start playback"}
                className="w-12 h-12 rounded bg-brand shadow-md active:translate-y-1 transition-all flex items-center justify-center text-slate-900 hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}
