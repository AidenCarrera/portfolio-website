"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const CELL_X = 20;
const CELL_Y = 14;
const DOT_SIZE = 2.5;
const MAX_DPR = 2;
const TAIL_ROWS = 8;
export const SPECTRUM_TAIL_HEIGHT = TAIL_ROWS * CELL_Y;
const BAR_BASE_ALPHA = 0.9;
const PEAK_DECAY_PER_SECOND = 3;
const MAX_FRAME_SECONDS = 1 / 20;
const NOISE_FLOOR = 0.05;
const POINTER_WIDTH = 0.05;
const POINTER_GLOW_WIDTH = 0.085;
const POINTER_GLOW = 0.65;
const BAR_COLOR = "#00ffcc";
const PEAK_COLOR = "#c6fff2";

interface SpectralPeak {
  centre: number;
  width: number;
  height: number;
  drift: number;
  driftRate: number;
  pulseRate: number;
  phase: number;
}

const PEAKS: SpectralPeak[] = [
  {
    centre: 0.05,
    width: 0.075,
    height: 0.66,
    drift: 0.02,
    driftRate: 0.21,
    pulseRate: 1.7,
    phase: 0,
  },
  {
    centre: 0.21,
    width: 0.06,
    height: 0.5,
    drift: 0.05,
    driftRate: 0.17,
    pulseRate: 1.1,
    phase: 1.4,
  },
  {
    centre: 0.42,
    width: 0.085,
    height: 0.42,
    drift: 0.06,
    driftRate: 0.13,
    pulseRate: 0.8,
    phase: 2.6,
  },
  {
    centre: 0.64,
    width: 0.07,
    height: 0.33,
    drift: 0.05,
    driftRate: 0.23,
    pulseRate: 1.4,
    phase: 0.7,
  },
  {
    centre: 0.84,
    width: 0.09,
    height: 0.26,
    drift: 0.04,
    driftRate: 0.19,
    pulseRate: 2.1,
    phase: 3.3,
  },
];

function spectrum(position: number, seconds: number): number {
  let energy = NOISE_FLOOR;

  for (const peak of PEAKS) {
    const centre =
      peak.centre +
      peak.drift * Math.sin(seconds * peak.driftRate + peak.phase);
    const distance = position - centre;
    const envelope =
      0.62 + 0.38 * Math.sin(seconds * peak.pulseRate + peak.phase);
    energy +=
      peak.height *
      envelope *
      Math.exp(-(distance * distance) / (2 * peak.width * peak.width));
  }

  return energy;
}

function wallStop(fraction: number): string {
  return `calc(${SPECTRUM_TAIL_HEIGHT}px + (100% - ${SPECTRUM_TAIL_HEIGHT}px) * ${fraction})`;
}

const CANVAS_STYLE: CSSProperties = {
  bottom: -SPECTRUM_TAIL_HEIGHT,
  height: `calc(56% + ${SPECTRUM_TAIL_HEIGHT}px)`,
  maskImage: `linear-gradient(to top, transparent, rgb(0 0 0 / 0.35) ${SPECTRUM_TAIL_HEIGHT / 2}px, black ${SPECTRUM_TAIL_HEIGHT}px, black ${wallStop(0.3)}, transparent ${wallStop(0.92)})`,
};

export default function HeroSpectrum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ position: 0.5, strength: 0, target: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let width = 0;
    let height = 0;
    let wallHeight = 0;
    let columns = 0;
    let rows = 0;
    let heldPeaks = new Float32Array(0);
    let staticLayer: HTMLCanvasElement | null = null;
    let frameId = 0;
    let onScreen = true;

    const buildStaticLayer = () => {
      const layer = document.createElement("canvas");
      layer.width = Math.max(1, Math.round(width * dpr));
      layer.height = Math.max(1, Math.round(height * dpr));

      const layerContext = layer.getContext("2d");
      if (!layerContext) {
        return null;
      }

      layerContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      layerContext.fillStyle = "rgba(148, 163, 184, 0.18)";

      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          layerContext.fillRect(
            column * CELL_X,
            wallHeight - (row + 1) * CELL_Y,
            DOT_SIZE,
            DOT_SIZE,
          );
        }
      }

      layerContext.globalAlpha = BAR_BASE_ALPHA;
      layerContext.fillStyle = BAR_COLOR;

      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < TAIL_ROWS; row += 1) {
          layerContext.fillRect(
            column * CELL_X,
            wallHeight + row * CELL_Y,
            DOT_SIZE,
            DOT_SIZE,
          );
        }
      }

      return layer;
    };

    const draw = (seconds: number, elapsed: number) => {
      context.clearRect(0, 0, width, height);

      if (staticLayer) {
        context.drawImage(staticLayer, 0, 0, width, height);
      }

      const pointer = pointerRef.current;
      pointer.strength += (pointer.target - pointer.strength) * 0.08;

      context.fillStyle = BAR_COLOR;

      for (let column = 0; column < columns; column += 1) {
        const position = columns > 1 ? column / (columns - 1) : 0;
        let energy = spectrum(position, seconds);
        let glow = 0;

        if (pointer.strength > 0.01) {
          const distance = position - pointer.position;
          const squared = distance * distance;
          energy +=
            pointer.strength *
            0.5 *
            Math.exp(-squared / (2 * POINTER_WIDTH * POINTER_WIDTH));
          glow =
            pointer.strength *
            POINTER_GLOW *
            Math.exp(-squared / (2 * POINTER_GLOW_WIDTH * POINTER_GLOW_WIDTH));
        }

        const lit = Math.min(rows, Math.round(Math.min(energy, 0.95) * rows));
        const x = column * CELL_X;

        for (let row = 0; row < lit; row += 1) {
          const alpha =
            (BAR_BASE_ALPHA - 0.55 * (row / Math.max(lit - 1, 1))) * (1 + glow);
          context.globalAlpha = alpha > 1 ? 1 : alpha;
          context.fillRect(
            x,
            wallHeight - (row + 1) * CELL_Y,
            DOT_SIZE,
            DOT_SIZE,
          );
        }

        heldPeaks[column] = Math.max(
          heldPeaks[column] - PEAK_DECAY_PER_SECOND * elapsed,
          lit,
        );
      }

      context.globalAlpha = 0.8;
      context.fillStyle = PEAK_COLOR;

      for (let column = 0; column < columns; column += 1) {
        const heldRow = Math.floor(heldPeaks[column]);

        if (heldRow > 0 && heldRow < rows) {
          context.fillRect(
            column * CELL_X,
            wallHeight - (heldRow + 1) * CELL_Y,
            DOT_SIZE,
            DOT_SIZE,
          );
        }
      }

      context.globalAlpha = 1;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      wallHeight = Math.max(0, height - SPECTRUM_TAIL_HEIGHT);
      columns = Math.ceil(width / CELL_X) + 1;
      rows = Math.ceil(wallHeight / CELL_Y) + 1;
      heldPeaks = new Float32Array(columns);
      staticLayer = buildStaticLayer();
      draw(0, 0);
    };

    let previousTime = 0;

    const renderFrame = (time: number) => {
      const seconds = time / 1000;
      const elapsed = previousTime
        ? Math.min(seconds - previousTime, MAX_FRAME_SECONDS)
        : 0;
      previousTime = seconds;
      draw(seconds, elapsed);
      frameId = requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (!frameId && onScreen && !prefersReducedMotion) {
        frameId = requestAnimationFrame(renderFrame);
      }
    };

    const stop = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        previousTime = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const pointer = pointerRef.current;
      const withinReach =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top - 260 &&
        event.clientY <= bounds.bottom;

      if (!withinReach) {
        pointer.target = 0;
        return;
      }

      pointer.position =
        (event.clientX - bounds.left) / Math.max(bounds.width, 1);
      pointer.target = 1;
    };

    const releasePointer = () => {
      pointerRef.current.target = 0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 },
    );

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", releasePointer);
    window.addEventListener("blur", releasePointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    start();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", releasePointer);
      window.removeEventListener("blur", releasePointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 w-full"
      style={CANVAS_STYLE}
    />
  );
}
