import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PlanetMark } from "../site/PlanetMark";
import { Starfield } from "../site/Starfield";

interface KeyConcept {
  term: string;
  definition: string;
}

type Props = {
  lessonTitle: string;
  score?: number;
  questionCount?: number;
  /** Lessons done in the course after this one, and the course total. */
  doneCount: number;
  lessonCount: number;
  /** The next lesson, or null when this was the last one. */
  next: { title: string; href: string } | null;
  courseHref: string;
  keyConcepts?: KeyConcept[];
};

/**
 * Shown after the quiz instead of the old 1.8-second redirect: a small sky card with the result, course progress
 * and the next lesson, then the lesson's key ideas.
 */
export function LessonComplete({ lessonTitle, score, questionCount, doneCount, lessonCount, next, courseHref, keyConcepts = [] }: Props) {
  const pct = lessonCount ? Math.round((doneCount / lessonCount) * 100) : 0;
  const scored = typeof score === "number" && typeof questionCount === "number" ? `You got ${score} of ${questionCount} right. ` : "";
  return (
    <>
      <section className="la-done-sky">
        <div className="la-sky" aria-hidden="true">
          <Starfield variant="band" />
        </div>
        <div className="la-done-mark">
          <PlanetMark size={34} tone="light" />
        </div>
        <h2 className="la-display">Lesson complete</h2>
        <p className="la-sub">
          {scored}
          {lessonTitle} is done.
        </p>
        <div className="la-done-prog">
          <div className="la-bar">
            <i style={{ ["--w" as string]: `${pct}%` }} />
          </div>
          <p>
            {doneCount} of {lessonCount} lessons done
          </p>
        </div>
        <div className="la-cta-row">
          {next ? (
            <Link className="la-btn la-btn-white la-btn-lg" to={next.href}>
              Next lesson: {next.title}
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <Link className="la-btn la-btn-white la-btn-lg" to={courseHref}>
              Back to the course
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
          {next && (
            <Link className="la-btn la-btn-ghost la-btn-lg" to={courseHref}>
              Back to course
            </Link>
          )}
        </div>
      </section>
      {keyConcepts.length > 0 && (
        <section className="la-keys">
          <h3>Key ideas from this lesson</h3>
          <dl>
            {keyConcepts.map((k, i) => (
              <div key={i}>
                <dt>{k.term}</dt>
                <dd>{k.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
