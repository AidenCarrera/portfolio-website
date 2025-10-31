"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();

    setIsPlaying(!isPlaying);
  };

  const handleScrub = (value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Array.isArray(value) ? value[0] : value;
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = Array.isArray(value) ? value[0] : value;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col space-y-2">
      {title && (
        <>
          <h3 className="text-white font-semibold">{title}</h3>
          <span className="text-sm text-slate-400">Olo</span>
        </>
      )}

      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Scrub slider with play button on the right */}
      <div className="flex items-center space-x-4">
        <Slider
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleScrub}
          styles={{
            track: { backgroundColor: "#1db954" },
            handle: { borderColor: "#1db954", width: 12, height: 12 },
            rail: { backgroundColor: "#555" },
          }}
          className="flex-1"
        />
        <span className="text-sm text-slate-300 w-12 text-right">
          {Math.floor(progress / 60)}:{("0" + Math.floor(progress % 60)).slice(-2)}
        </span>
        <button
          onClick={togglePlay}
          className="bg-brand-dark hover:bg-brand text-white p-2 rounded-full"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Volume slider small and compact */}
      <div className="flex items-center space-x-2 w-32 mt-1">
        <Volume2 className="text-slate-300" size={16} />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          styles={{
            track: { backgroundColor: "#1db954" },
            handle: { borderColor: "#1db954", width: 10, height: 10 },
            rail: { backgroundColor: "#555" },
          }}
          className="flex-1"
        />
      </div>
    </div>
  );
}
