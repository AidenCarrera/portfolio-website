import { useState, useRef, useEffect } from "react";
import { useAnimation } from "motion/react";
import { MusicSnippet } from "@/types";

export function useTapePlayer(activeSnippet: MusicSnippet | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isDraggingTime, setIsDraggingTime] = useState(false);
  const [prevSnippetId, setPrevSnippetId] = useState(activeSnippet?.id);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controls = useAnimation();

  // Reset state when snippet changes
  if (activeSnippet?.id !== prevSnippetId) {
    setPrevSnippetId(activeSnippet?.id);
    setIsPlaying(false);
    setCurrentTime(0);
  }

  useEffect(() => {
    controls.stop();
    controls.set({ rotate: 0 });

    if (activeSnippet && audioRef.current) {
      audioRef.current.src = activeSnippet.audio_url;
      audioRef.current.load();
    }
  }, [activeSnippet, controls]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume * 0.75;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!activeSnippet || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      controls.stop();
    } else {
      audioRef.current.play();
      controls.start({
        rotate: 360,
        transition: { repeat: Infinity, duration: 1, ease: "linear" },
      });
    }
    setIsPlaying((p) => !p);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    controls.stop();
    controls.set({ rotate: 0 });
  };

  const seek = (newTime: number, commit: boolean) => {
    setCurrentTime(newTime);
    if (commit && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDraggingTime) {
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

  return {
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
  };
}
