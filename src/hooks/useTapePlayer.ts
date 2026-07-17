import { useState, useRef, useEffect, useCallback } from "react";
import { useAnimation } from "motion/react";
import type { MusicSnippet } from "@/types";

export function useTapePlayer(activeSnippet: MusicSnippet | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controls = useAnimation();

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

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!activeSnippet || !audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      controls.stop();
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      controls.start({
        rotate: 360,
        transition: { repeat: Infinity, duration: 1, ease: "linear" },
      });
    } catch (error) {
      console.error("Unable to start audio playback:", error);
      setIsPlaying(false);
      controls.stop();
      controls.set({ rotate: 0 });
    }
  }, [activeSnippet, controls]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    controls.stop();
    controls.set({ rotate: 0 });
  }, [controls]);

  const seek = useCallback((newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    controls.stop();
    controls.set({ rotate: 0 });
  }, [controls]);

  return {
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
  };
}
