import { MusicSnippet } from "@/types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Square } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

interface CassetteDeckProps {
    activeSnippet: MusicSnippet | null;
}

export default function CassetteDeck({ activeSnippet }: CassetteDeckProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragStartVolume, setDragStartVolume] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const controls = useAnimation();

    // Reset state when snippet changes
    useEffect(() => {
        if (activeSnippet) {
            setIsPlaying(false);
            setCurrentTime(0);
            if (audioRef.current) {
                audioRef.current.src = activeSnippet.audio_url;
                audioRef.current.load();
                audioRef.current.volume = volume;
            }
        } else {
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, [activeSnippet]);

    // Update volume when state changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle Play/Pause
    const togglePlay = () => {
        if (!activeSnippet || !audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            controls.stop();
        } else {
            audioRef.current.play();
            controls.start({
                rotate: 360,
                transition: { repeat: Infinity, duration: 1, ease: "linear" }
            });
        }
        setIsPlaying(!isPlaying);
    };

    // Handle Stop
    const stop = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        controls.stop();
        controls.set({ rotate: 0 });
    };

    // Update time
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        controls.stop();
        controls.set({ rotate: 0 });
    };

    // Volume Knob Logic (Vertical Drag)
    const handleVolumeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDraggingVolume(true);
        setDragStartY(e.clientY);
        setDragStartVolume(volume);
    };

    const handleVolumeMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingVolume) return;

        // Calculate delta
        const deltaY = dragStartY - e.clientY; // Positive = Up (Increase), Negative = Down (Decrease)

        // Sensitivity: 100px = full volume range (0 to 1)
        const volumeChange = deltaY / 100;

        const newVolume = Math.min(1, Math.max(0, dragStartVolume + volumeChange));
        setVolume(newVolume);
    }, [isDraggingVolume, dragStartY, dragStartVolume]);

    const handleVolumeMouseUp = useCallback(() => {
        setIsDraggingVolume(false);
    }, []);

    useEffect(() => {
        if (isDraggingVolume) {
            window.addEventListener('mousemove', handleVolumeMouseMove);
            window.addEventListener('mouseup', handleVolumeMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'ns-resize';
        } else {
            window.removeEventListener('mousemove', handleVolumeMouseMove);
            window.removeEventListener('mouseup', handleVolumeMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
        return () => {
            window.removeEventListener('mousemove', handleVolumeMouseMove);
            window.removeEventListener('mouseup', handleVolumeMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isDraggingVolume, handleVolumeMouseMove, handleVolumeMouseUp]);

    // Calculate rotation for visual knob based on volume
    // 0 -> -135deg
    // 1 -> 135deg
    const knobRotation = (volume * 270) - 135;

    // Format time
    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            <div className="bg-slate-800 rounded-3xl p-1 shadow-2xl border border-slate-700 relative overflow-hidden">
                {/* Metallic Texture Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none rounded-3xl" />

                <div className="bg-slate-900 rounded-[1.4rem] p-6 sm:p-8 relative">
                    {/* Deck Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${activeSnippet ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-red-900'}`} />
                            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Power On</span>
                        </div>
                        <div className="text-right">
                            <h3 className="text-brand font-bold uppercase tracking-widest text-sm">Tape Player</h3>
                            <p className="text-[10px] text-slate-500 font-mono">STEREO CASSETTE DECK</p>
                        </div>
                    </div>

                    {/* Cassette Window */}
                    <div className="bg-slate-800 rounded-xl p-4 mb-8 border-4 border-slate-700 shadow-inner relative overflow-hidden h-72 flex items-center justify-center">
                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20" />

                        {activeSnippet ? (
                            <div className="relative w-full max-w-sm aspect-[1.6] bg-slate-800 border-2 border-slate-700 rounded-lg shadow-xl flex flex-col p-2 transform transition-all">
                                {/* Texture overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

                                {/* Top Screw Area */}
                                <div className="flex justify-between px-1 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                                </div>

                                {/* Label Area */}
                                <div className="flex-1 bg-slate-200 rounded mx-1 relative overflow-hidden shadow-sm border border-slate-300">
                                    <div className="absolute top-0 left-0 w-full h-3 bg-brand" />
                                    <div className="h-full flex items-center justify-center pt-2">
                                        <span className="font-mono text-slate-900 font-bold text-sm sm:text-lg leading-tight uppercase tracking-tight truncate px-4 text-center">
                                            {activeSnippet.title}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-3 bg-brand/80" />
                                </div>

                                {/* Tape Window Area - The Trapezoid Shape */}
                                <div className="mt-1 h-16 relative mx-2">
                                    {/* The Trapezoid Background */}
                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-700 rounded-b-lg transform perspective-[100px] rotate-x-12 border-t border-slate-600" />

                                    {/* Actual Window */}
                                    <div className="absolute bottom-2 left-4 right-4 h-8 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-between px-2 shadow-inner">
                                        {/* Left Reel */}
                                        <motion.div
                                            animate={controls}
                                            className="w-8 h-8 rounded-full border-2 border-slate-500 bg-white relative"
                                        >
                                            <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
                                        </motion.div>

                                        {/* Tape Window Center */}
                                        <div className="flex-1 mx-2 h-4 bg-black/60 rounded-sm border border-slate-700" />

                                        {/* Right Reel */}
                                        <motion.div
                                            animate={controls}
                                            className="w-8 h-8 rounded-full border-2 border-slate-500 bg-white relative"
                                        >
                                            <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Bottom Screw Area */}
                                <div className="flex justify-between px-1 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-600 font-mono text-sm uppercase tracking-widest">
                                No Cassette Loaded
                            </div>
                        )}
                    </div>

                    {/* Controls Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        {/* LCD Display */}
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600 shadow-inner font-mono relative overflow-hidden">
                            <div className="flex justify-between items-center text-brand mb-2">
                                <div className="text-xs text-brand tracking-widest uppercase">Playback</div>
                                <div className="text-lg font-bold tracking-wider">
                                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                                </div>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
                                {/* Progress Fill */}
                                <div
                                    className="h-full bg-brand shadow-[0_0_10px_rgba(51,230,204,0.8)] transition-all duration-100 relative"
                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                >
                                    {/* Glow at tip */}
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]" />
                                </div>
                            </div>
                        </div>

                        {/* Buttons & Volume */}
                        <div className="flex justify-end items-end space-x-6">
                            {/* Volume Knob */}
                            <div className="flex flex-col items-center mr-4">
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Vol</div>
                                <div
                                    className="relative w-12 h-12 flex items-center justify-center cursor-ns-resize group"
                                    onMouseDown={handleVolumeMouseDown}
                                >
                                    {/* Tick Marks */}
                                    {Array.from({ length: 11 }).map((_, i) => {
                                        const angle = -135 + (i * 27);
                                        return (
                                            <div
                                                key={i}
                                                className="absolute w-0.5 h-1.5 bg-slate-600 origin-bottom"
                                                style={{
                                                    transform: `rotate(${angle}deg) translateY(-18px)`,
                                                    opacity: 0.3 + (i / 10) * 0.7
                                                }}
                                            />
                                        );
                                    })}

                                    {/* The Knob */}
                                    <div
                                        className="w-9 h-9 rounded-full bg-linear-to-br from-slate-300 to-slate-500 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-slate-600 relative transition-transform duration-75 ease-out group-hover:brightness-110"
                                        style={{ transform: `rotate(${knobRotation}deg)` }}
                                    >
                                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={stop}
                                disabled={!activeSnippet}
                                className="w-12 h-12 rounded bg-slate-700 shadow-[0_4px_0_rgb(30,41,59),0_5px_10px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Square size={16} fill="currentColor" />
                            </button>
                            <button
                                onClick={togglePlay}
                                disabled={!activeSnippet}
                                className="w-12 h-12 rounded bg-brand shadow-[0_4px_0_rgb(38,172,153),0_5px_10px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center text-slate-900 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
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
