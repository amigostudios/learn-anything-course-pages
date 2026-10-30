import { useEffect, useState } from "react";

interface Props {
  /** e.g. "Preparing your lesson" / "Building your course on Beekeeping" */
  title?: string;
  /** e.g. "The Pinch Grip · about ten seconds" */
  subtitle?: string;
  steps?: string[];
  /** Kept for API compatibility with existing callers. */
  estimateText?: string;
  /** Expected duration in seconds — paces the bar and the step list. Default: 12s. */
  estimatedSeconds?: number;
}

const TIPS = [
  "Teaching a topic out loud is the fastest way to learn it.",
  "A five-minute recap tomorrow beats an hour of review next week.",
  "Practice recalling, not just re-reading, locks knowledge in.",
  "If you can’t explain it simply, you don’t understand it yet.",
  "Spaced repetition beats cramming, every time.",
  "Sleep is when memories move from fragile to permanent.",
  "Ten minutes a day beats ten hours once a month.",
  "Mistakes are the fastest teachers you’ll ever meet.",
];

const DEFAULT_STEPS = ["Reading the lesson plan", "Writing the explanation", "Designing the visuals", "Preparing the narration"];

/**
 * Restyled wait screen (same props as before, plus `subtitle`): the ring-planet mark with the learner dot on its lap,
 * a bar paced to the estimate, the steps lighting up in turn, and a tip.
 */
export function GenerationLoader({ title = "Preparing your lesson", subtitle, steps = DEFAULT_STEPS, estimateText, estimatedSeconds = 12 }: Props) {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [step, setStep] = useState(0);

  useEffect(() => {
    const per = (estimatedSeconds * 1000) / (steps.length + 0.5);
    const id = setInterval(() => setStep((s) => Math.min(steps.length, s + 1)), per);
    return () => clearInterval(id);
  }, [estimatedSeconds, steps.length]);

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="la-app">
      <div className="la-loading" role="status" aria-live="polite">
        <div className="la-loading-in">
          <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
            <defs>
              <clipPath id="la-mk-back">
                <rect x="-20" y="-28" width="104" height="60" />
              </clipPath>
              <clipPath id="la-mk-front">
                <rect x="-20" y="32" width="104" height="60" />
              </clipPath>
            </defs>
            <g transform="rotate(-18 32 32)" clipPath="url(#la-mk-back)">
              <ellipse cx="32" cy="32" rx="27" ry="8" fill="none" stroke="#8DB6FF" strokeWidth="3.2" />
              <circle r="3.4" fill="#F2A14F" stroke="#fff" strokeWidth="1.2">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M59 32 A27 8 0 1 1 5 32 A27 8 0 1 1 59 32" />
              </circle>
            </g>
            <circle cx="32" cy="32" r="15" fill="#0F62E6" />
            <g transform="rotate(-18 32 32)" clipPath="url(#la-mk-front)">
              <ellipse cx="32" cy="32" rx="27" ry="8" fill="none" stroke="#8DB6FF" strokeWidth="3.2" />
              <circle r="3.4" fill="#F2A14F" stroke="#fff" strokeWidth="1.2">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M59 32 A27 8 0 1 1 5 32 A27 8 0 1 1 59 32" />
              </circle>
            </g>
          </svg>
          <h1 className="la-display">{title}</h1>
          {(subtitle || estimateText) && <p className="la-sub">{subtitle ?? estimateText}</p>}
          <div className="la-bar" role="progressbar" aria-label="Generating">
            <i style={{ animationDuration: `${estimatedSeconds}s` }} />
          </div>
          <ol className="la-steps-l">
            {steps.map((s, i) => (
              <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""}>
                {s}
              </li>
            ))}
          </ol>
          <p className="la-tip" key={tipIndex}>
            {TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
