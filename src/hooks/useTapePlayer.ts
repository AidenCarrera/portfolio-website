import { useState, useRef, useEffect, useCallback } from "react";
import { useAnimation } from "motion/react";
import type { MusicSnippet } from "@/types";

// Previews are mastered hot, so the slider's full range maps to 75% of the
// element's gain to keep playback from being jarring.
const MAX_GAIN = 0.75;

export function useTapePlayer(activeSnippet: MusicSnippet | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controls = useAnimation();

  // load() pauses the element and resets the clock, so playback state comes
  // back through its events. Volume stays on the element across tape changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!activeSnippet || !audio) return;

    const wasPlaying = !audio.paused;

    audio.src = activeSnippet.audio_url;
    audio.load();

    // Keep the deck rolling when swapping tapes mid-playback.
    if (wasPlaying) {
      audio.play().catch((error) => {
        console.error("Unable to start audio playback:", error);
      });
    }
  }, [activeSnippet]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume * MAX_GAIN;
    }
  }, [volume]);

  // Playback state is driven entirely by the element's events, so a tape swap
  // that pauses and immediately replays settles on the right state regardless
  // of the order those events land in.
  const handlePlaybackStarted = useCallback(() => {
    setIsPlaying(true);
    controls.start({
      rotate: 360,
      transition: { repeat: Infinity, duration: 1, ease: "linear" },
    });
  }, [controls]);

  const handlePlaybackStopped = useCallback(() => {
    setIsPlaying(false);
    controls.stop();
    controls.set({ rotate: 0 });
  }, [controls]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!activeSnippet || !audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch (error) {
      console.error("Unable to start audio playback:", error);
      handlePlaybackStopped();
    }
  }, [activeSnippet, handlePlaybackStopped]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

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
    handlePlaybackStarted,
    handlePlaybackStopped,
  };
}
