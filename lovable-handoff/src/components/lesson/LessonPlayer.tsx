import { useEffect, useRef, useState, useCallback } from "react";
import { Play } from "lucide-react";
import { SegmentVisualRenderer, stageCaption, stageClass, type AnyVisual } from "./SegmentVisual";
import { VisualErrorBoundary } from "@/components/VisualErrorBoundary";
import { SegmentProgress } from "./SegmentProgress";
import { PlayerBar, SPEED_OPTIONS, type Speed } from "./PlayerBar";

/** A lesson segment. v2 lessons carry `kind`, `key_idea` and `body`; the store keeps `narration` for the audio pipeline. */
export interface LessonSegment {
  /** v1 segment type (intro, concept, steps, comparison, visual, summary). */
  type?: string;
  /** v2 segment kind (intro, concept, process, stat, practice, anatomy, summary, real object). */
  kind?: string;
  heading: string;
  /** v2: one sentence, max 90 characters, shown under the heading. */
  key_idea?: string;
  narration?: string;
  /** v2 name for the narration text; used when `narration` is absent. */
  body?: string;
  visual: AnyVisual;
}

interface KeyConcept {
  term: string;
  definition: string;
}

interface LessonPlayerProps {
  segments: LessonSegment[];
  audioBySegment: (string | null)[]; // base64 mp3 or null (still loading / failed)
  wordTimingsBySegment?: (number[] | null)[]; // per-segment word start times in seconds
  onComplete: () => void;
  onSegmentChange?: (index: number) => void;
  keyConcepts?: KeyConcept[];
  /** Kept for API compatibility; the Ask button now lives in LessonTopBar. */
  onAskTeacher?: () => void;
}

const SPEED_STORAGE_KEY = "lessonPlayer.playbackRate";

/**
 * Restyled lesson player. The playback logic (audio element, word timings, auto-advance, keyboard shortcuts,
 * tap-to-play fallback, persisted speed) is the existing LessonPlayer's, line for line; only the rendered
 * structure changed: segmented progress, a stage for the visual, centred heading and narration, PlayerBar.
 * It expects to sit inside LessonShell's scrolling area (see routes/learn.$topicId.$lessonId.example.tsx).
 */
export function LessonPlayer({ segments, audioBySegment, wordTimingsBySegment, onComplete, onSegmentChange, keyConcepts, onAskTeacher }: LessonPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0..1
  const [revealedWords, setRevealedWords] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<Speed>(() => {
    if (typeof window === "undefined") return 1;
    const stored = Number(window.localStorage.getItem(SPEED_STORAGE_KEY));
    return (SPEED_OPTIONS as readonly number[]).includes(stored) ? (stored as Speed) : 1;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  const lastScrolledWordRef = useRef<number>(-1);

  const segment = segments[currentIndex];
  const narration = segment ? (segment.narration ?? segment.body ?? "") : "";
  const words = narration.split(/\s+/).filter(Boolean);
  const audio64 = audioBySegment[currentIndex];
  const wordTimings = wordTimingsBySegment?.[currentIndex] ?? null;
  const isLastSegment = currentIndex === segments.length - 1;

  const goNext = useCallback(() => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [currentIndex, segments.length, onComplete]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  // Reset when segment changes
  useEffect(() => {
    setAudioProgress(0);
    setRevealedWords(0);
    setIsPlaying(false);
    setNeedsTapToPlay(false);
    lastScrolledWordRef.current = -1;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    onSegmentChange?.(currentIndex);
  }, [currentIndex, onSegmentChange]);

  // Setup audio when audio for current segment becomes available
  useEffect(() => {
    if (!audio64) return;
    const audio = new Audio(`data:audio/mpeg;base64,${audio64}`);
    audio.playbackRate = playbackRate;
    audioRef.current = audio;

    const onLoaded = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setNeedsTapToPlay(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setNeedsTapToPlay(true);
        });
    };
    let advanceTimer: ReturnType<typeof setTimeout> | null = null;
    const onEnd = () => {
      setIsPlaying(false);
      setRevealedWords(words.length);
      setAudioProgress(1);
      advanceTimer = setTimeout(() => goNext(), 600);
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
      if (advanceTimer) clearTimeout(advanceTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio64, currentIndex]);

  // Apply playback rate changes to current audio + persist
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SPEED_STORAGE_KEY, String(playbackRate));
    }
  }, [playbackRate]);

  // Sync word reveal + progress to audio playback
  useEffect(() => {
    if (!isPlaying) return;
    const hasTimings = Array.isArray(wordTimings) && wordTimings.length > 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration > 0) {
        const t = audio.currentTime;
        setAudioProgress(t / audio.duration);
        if (hasTimings) {
          let count = 0;
          for (let i = 0; i < wordTimings!.length; i++) {
            if (wordTimings![i] <= t) count++;
            else break;
          }
          setRevealedWords(Math.min(words.length, count));
        } else {
          const ratio = t / audio.duration;
          setRevealedWords(Math.min(words.length, Math.ceil(ratio * words.length)));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, words.length, wordTimings]);

  // Auto-scroll active word into view (every ~10 words to avoid jitter)
  useEffect(() => {
    if (!isPlaying) return;
    if (revealedWords <= 0) return;
    if (revealedWords - lastScrolledWordRef.current < 10 && lastScrolledWordRef.current !== -1) return;
    lastScrolledWordRef.current = revealedWords;
    const el = activeWordRef.current;
    const container = scrollRef.current;
    if (!el || !container) return;
    if (container.scrollHeight <= container.clientHeight + 4) return;
    const elTop = el.offsetTop;
    const target = Math.max(0, elTop - container.clientHeight / 2);
    container.scrollTo({ top: target, behavior: "smooth" });
  }, [revealedWords, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setNeedsTapToPlay(false);
        })
        .catch(() => {
          setNeedsTapToPlay(true);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const skipReveal = useCallback(() => {
    setRevealedWords(words.length);
  }, [words.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, goNext, goPrev]);

  if (!segment) return null;

  const audioReady = audio64 !== null && audio64 !== undefined;
  const showOverlay = needsTapToPlay && !isPlaying && audioReady;
  const caption = stageCaption(segment.visual);
  void keyConcepts;
  void onAskTeacher;

  return (
    <>
      <SegmentProgress total={segments.length} current={currentIndex} progress={audioProgress} type={segment.kind ?? segment.type ?? ""} />

      <div ref={scrollRef} className="la-lmain">
        <div className="la-lcol" key={currentIndex}>
          <div className="la-slot">
            <div className={stageClass(segment.visual)}>
            <VisualErrorBoundary>
              <SegmentVisualRenderer visual={segment.visual} />
            </VisualErrorBoundary>
            {showOverlay && (
              <button type="button" className="la-tap" onClick={togglePlay} aria-label="Play narration">
                <span className="la-tap-in">
                  <span className="la-tap-btn">
                    <Play fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  </span>
                  <span className="la-tap-label">Tap to start narration</span>
                </span>
              </button>
            )}
            </div>
          </div>
          {caption && <p className="la-cap">{caption}</p>}
          <h1 className="la-lh">{segment.heading}</h1>
          {segment.key_idea && <p className="la-key">{segment.key_idea}</p>}
          <p className="la-nar" onClick={skipReveal} title="Tap to show all the text">
            {words.map((word, i) => {
              const isActive = i === Math.max(0, revealedWords - 1);
              return (
                <span key={i} ref={isActive ? activeWordRef : undefined} className={i < revealedWords ? undefined : "is-dim"}>
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
          {!audioReady && <p className="la-nar-hint">Preparing narration…</p>}
          {audioReady && (
            <p className="la-nar-hint">
              <span className="la-kbd">Space</span> play or pause &nbsp;·&nbsp; <span className="la-kbd">←</span>
              <span className="la-kbd">→</span> move between parts
            </p>
          )}
        </div>
      </div>

      <PlayerBar
        isPlaying={isPlaying}
        canPrev={currentIndex > 0}
        isLast={isLastSegment}
        audioReady={audioReady}
        speed={playbackRate}
        onTogglePlay={togglePlay}
        onPrev={goPrev}
        onNext={goNext}
        onSpeed={setPlaybackRate}
      />
    </>
  );
}
