"use client";

import { Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  title: string;
  audioUrl: string;
  caption?: string;
  gearUsed?: string;
  status?: string;
}

export default function AudioPlayer({ title, audioUrl, caption, gearUsed, status }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-amber-400/50 transition-all">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {status && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
              {status}
            </span>
          )}
        </div>
      </div>

      {caption && <p className="text-slate-400 text-sm mb-3">{caption}</p>}
      {gearUsed && (
        <p className="text-slate-500 text-xs mb-4">
          <span className="text-slate-400 font-medium">Gear:</span> {gearUsed}
        </p>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause size={20} className="text-slate-900" />
          ) : (
            <Play size={20} className="text-slate-900 ml-1" />
          )}
        </button>

        <div className="flex-1">
          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-amber-400 to-orange-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500">{formatTime(currentTime)}</span>
            <span className="text-xs text-slate-500">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
