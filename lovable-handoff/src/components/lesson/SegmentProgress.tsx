import { CircleCheck, Sparkles } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  intro: "Intro",
  concept: "Concept",
  process: "Process",
  stat: "Stat",
  practice: "Practice",
  anatomy: "Anatomy",
  "real object": "Real object",
  steps: "Steps",
  comparison: "Compare",
  example: "Example",
  visual: "Visual",
  summary: "Summary",
  quiz: "Quiz",
  complete: "Complete",
};

type Props = {
  /** Number of segments in the lesson. */
  total: number;
  /** Index of the current segment. */
  current: number;
  /** 0..1 progress through the current segment (audio time / duration). */
  progress: number;
  /** Segment type from the lesson data ("intro", "concept", …) or "quiz" / "complete". */
  type: string;
  /** Text on the right: "2 of 6", "Check your understanding", "Lesson 1 of 10". */
  label?: string;
  /** Mark every tick done (quiz and complete states). */
  allDone?: boolean;
};

/** One tick per segment under the top bar; the current tick fills with the narration. */
export function SegmentProgress({ total, current, progress, type, label, allDone = false }: Props) {
  const Icon = type === "quiz" ? CircleCheck : Sparkles;
  return (
    <div className="la-prog">
      <div className="la-prog-in">
        <div className="la-prog-row">
          <span className="la-type">
            <Icon aria-hidden="true" />
            {TYPE_LABEL[type] ?? type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          <span className="la-tabular">{label ?? `${current + 1} of ${total}`}</span>
        </div>
        <div className="la-segs" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span className={"la-seg" + (allDone || i < current ? " is-done" : "")} key={i}>
              <i style={i === current && !allDone ? { width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` } : undefined} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
