import { MusicSnippet } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Square } from "lucide-react";
import { motion } from "motion/react";
import { useTapePlayer } from "@/hooks/useTapePlayer";

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
    isDraggingTime,
    setIsDraggingTime,
    audioRef,
    controls,
    togglePlay,
    stop,
    seek,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  } = useTapePlayer(activeSnippet);

  // UI state for volume knob dragging
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartVolume, setDragStartVolume] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Volume Knob Logic (Vertical Drag & Keyboard support)
  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingVolume(true);
    setDragStartY(e.clientY);
    setDragStartVolume(volume);
  };

  const handleVolumeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      setVolume((v) => Math.min(1, v + 0.05));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      setVolume((v) => Math.max(0, v - 0.05));
    }
  };

  const handleVolumeMouseMove = (e: MouseEvent) => {
    if (!isDraggingVolume) return;
    const deltaY = dragStartY - e.clientY;
    const volumeChange = deltaY / 100;
    const newVolume = Math.min(1, Math.max(0, dragStartVolume + volumeChange));
    setVolume(newVolume);
  };

  useEffect(() => {
    const up = () => setIsDraggingVolume(false);
    if (isDraggingVolume) {
      window.addEventListener("mousemove", handleVolumeMouseMove);
      window.addEventListener("mouseup", up);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ns-resize";
    }
    return () => {
      window.removeEventListener("mousemove", handleVolumeMouseMove);
      window.removeEventListener("mouseup", up);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDraggingVolume, handleVolumeMouseMove]);

  // Handle Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && activeSnippet) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSnippet, togglePlay]);

  // Scrubbing logic
  const calculateTime = (e: React.MouseEvent | MouseEvent) => {
    if (!progressBarRef.current || !duration) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max(x / rect.width, 0), 1);
    return percentage * duration;
  };

  const handleTimeMouseDown = (e: React.MouseEvent) => {
    if (!activeSnippet) return;
    setIsDraggingTime(true);
    seek(calculateTime(e), false);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (!activeSnippet || !duration) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      seek(Math.min(duration, currentTime + 5), true);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      seek(Math.max(0, currentTime - 5), true);
    }
  };

  useEffect(() => {
    const move = (e: MouseEvent) => isDraggingTime && seek(calculateTime(e), false);
    const up = (e: MouseEvent) => {
      if (isDraggingTime) {
        setIsDraggingTime(false);
        seek(calculateTime(e), true);
      }
    };
    if (isDraggingTime) {
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    }
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDraggingTime, calculateTime, seek, setIsDraggingTime]);

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
              <div className={`w-3 h-3 rounded-full ${activeSnippet ? "bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-red-900"}`} />
              <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Power On</span>
            </div>
            <div className="text-right">
              <h3 className="text-brand font-bold uppercase tracking-widest text-sm">Tape Player</h3>
              <p className="text-[10px] text-slate-500 font-mono">STEREO CASSETTE DECK</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 mb-8 border-4 border-slate-700 shadow-inner relative overflow-hidden h-72 flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20" />
            {activeSnippet ? (
              <div className="relative w-full max-w-sm aspect-[1.6] bg-slate-800 border-2 border-slate-700 rounded-lg shadow-xl flex flex-col p-2 transform transition-all">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
                <div className="flex justify-between px-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600" />
                </div>
                <div className="flex-1 bg-slate-200 rounded mx-1 relative overflow-hidden shadow-sm border border-slate-300">
                  <div className="absolute top-0 left-0 w-full h-3 bg-brand" />
                  <div className="h-full flex items-center justify-center pt-2">
                    <span className="font-mono text-slate-900 font-bold text-sm sm:text-lg uppercase truncate px-4 text-center">
                      {activeSnippet.title}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-3 bg-brand/80" />
                </div>
                <div className="mt-1 h-16 relative mx-2">
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-700 rounded-b-lg transform perspective-dramatic rotate-x-12 border-t border-slate-600" />
                  <div className="absolute bottom-2 left-4 right-4 h-8 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-between px-2 shadow-inner">
                    <motion.div animate={controls} className="w-8 h-8 rounded-full border-2 border-slate-500 bg-white relative">
                      <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
                    </motion.div>
                    <div className="flex-1 mx-2 h-4 bg-black/60 rounded-sm border border-slate-700" />
                    <motion.div animate={controls} className="w-8 h-8 rounded-full border-2 border-slate-500 bg-white relative">
                      <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
                    </motion.div>
                  </div>
                </div>
                <div className="flex justify-between px-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600" />
                </div>
              </div>
            ) : (
              <div className="text-slate-600 font-mono text-sm uppercase tracking-widest">No Cassette Loaded</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600 shadow-inner font-mono relative overflow-hidden">
              <div className="flex justify-between items-center text-brand mb-2">
                <div className="text-xs tracking-widest uppercase">Playback</div>
                <div className="text-lg font-bold tracking-wider">{formatTime(currentTime)} / {formatTime(duration || 0)}</div>
              </div>
              <div
                ref={progressBarRef}
                role="slider"
                aria-label="Playback position"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration || 0)}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration || 0)}`}
                tabIndex={activeSnippet ? 0 : -1}
                onKeyDown={handleTimeKeyDown}
                className={`w-full bg-slate-800 h-2 rounded-full relative group focus:outline-none ${activeSnippet ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-brand" : ""}`}
                onMouseDown={handleTimeMouseDown}
              >
                <div
                  className={`h-full bg-brand shadow-[0_0_10px_rgba(51,230,204,0.8)] relative ${isDraggingTime ? "transition-none" : "transition-all duration-100"}`}
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]" />
                </div>
                <div
                  className={`absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-brand -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 pointer-events-none ${isDraggingTime ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-end items-end space-x-6">
              <div className="flex flex-col items-center mr-4">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Vol</div>
                <div
                  role="slider"
                  aria-label="Volume"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(volume * 100)}
                  aria-valuetext={`${Math.round(volume * 100)}%`}
                  tabIndex={0}
                  onKeyDown={handleVolumeKeyDown}
                  className="relative w-12 h-12 flex items-center justify-center cursor-ns-resize group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
                  onMouseDown={handleVolumeMouseDown}
                >
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-1.5 bg-slate-600 origin-bottom"
                      style={{ transform: `rotate(${-135 + i * 27}deg) translateY(-18px)`, opacity: 0.3 + (i / 10) * 0.7 }}
                    />
                  ))}
                  <div
                    className="w-9 h-9 rounded-full bg-linear-to-br from-slate-300 to-slate-500 shadow-lg border border-slate-600 relative transition-transform duration-75 ease-out group-hover:brightness-110"
                    style={{ transform: `rotate(${knobRotation}deg)` }}
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-slate-800 rounded-full" />
                  </div>
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
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
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
