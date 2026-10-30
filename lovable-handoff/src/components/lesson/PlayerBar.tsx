import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export const SPEED_OPTIONS = [1, 1.5, 2] as const;
export type Speed = (typeof SPEED_OPTIONS)[number];

type Props = {
  isPlaying: boolean;
  canPrev: boolean;
  isLast: boolean;
  /** Disabled while the segment's narration is still being prepared. */
  audioReady: boolean;
  speed: Speed;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeed: (s: Speed) => void;
};

/**
 * The narration controls. A floating pill on desktop; a full-width docked bar with safe-area padding below 640px,
 * where the segmented speed control becomes one cycling pill.
 */
export function PlayerBar({ isPlaying, canPrev, isLast, audioReady, speed, onTogglePlay, onPrev, onNext, onSpeed }: Props) {
  const cycle = () => onSpeed(SPEED_OPTIONS[(SPEED_OPTIONS.indexOf(speed) + 1) % SPEED_OPTIONS.length]);
  return (
    <div className="la-player">
      <div className="la-player-pill" role="group" aria-label="Narration controls">
        <button className="la-pbtn" type="button" onClick={onPrev} disabled={!canPrev} aria-label="Previous segment">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          className={"la-play" + (isPlaying ? " is-playing" : "")}
          type="button"
          onClick={onTogglePlay}
          disabled={!audioReady}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="pp" fill="currentColor" strokeWidth={0} /> : <Play className="p" fill="currentColor" strokeWidth={0} />}
        </button>
        <button className="la-pnext" type="button" onClick={onNext} aria-label={isLast ? "Finish lesson" : "Next segment"}>
          <span>{isLast ? "Finish" : "Next"}</span>
          <ChevronRight aria-hidden="true" />
        </button>
        <span className="la-pdiv" aria-hidden="true" />
        <div className="la-speed" role="group" aria-label="Playback speed">
          {SPEED_OPTIONS.map((s) => (
            <button key={s} type="button" aria-pressed={speed === s} onClick={() => onSpeed(s)}>
              {s}x
            </button>
          ))}
        </div>
        <button className="la-speed-cycle" type="button" onClick={cycle} aria-label={`Playback speed ${speed}x, tap to change`}>
          {speed}x
        </button>
      </div>
    </div>
  );
}
