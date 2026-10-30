import { Link } from "@tanstack/react-router";
import { Check, Flag, Lock } from "lucide-react";
import type { Course, LessonAccess, ProgressState } from "./types";

type Props = {
  course: Course;
  progress: ProgressState;
  /** Route for a lesson, e.g. `/learn/${topicId}/${moduleIndex}-${lessonIndex}` plus its search params. */
  lessonHref: (moduleIndex: number, lessonIndex: number) => string;
  /**
   * For visitors on the public course page: what each lesson needs. Return null to show no tag.
   * Enrolled learners get Done / Up next from `progress` instead.
   */
  access?: (lessonId: string, lessonNumber: number) => LessonAccess | null;
  /** Short mode for the lessons drawer: no descriptions. */
  compact?: boolean;
  /** Called when a lesson link is clicked (the drawer uses it to close). */
  onNavigate?: () => void;
  /** Render the end-of-course review card after the modules (course page only). */
  review?: { unlocked: boolean; href?: string; onStart?: () => void };
};

const ACCESS_TAG: Record<LessonAccess, { text: string; cls: string }> = {
  open: { text: "Free · no sign-up", cls: " is-free" },
  signin: { text: "Free · sign in", cls: "" },
  pro: { text: "Pro", cls: "" },
};

/**
 * Modules as numbered sections, lessons as a connected path with done / up-next / upcoming nodes.
 * Shared by the course page and the lessons drawer (`compact`).
 */
export function CourseOutline({ course, progress, lessonHref, access, compact = false, onNavigate, review }: Props) {
  let n = 0;
  return (
    <>
      {course.modules.map((m, mi) => (
        <section className="la-mod" key={mi}>
          <div className="la-mod-head">
            <span className="la-mod-num">{mi + 1}</span>
            <div>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <p className="la-mod-count">{m.lessons.length} lessons</p>
            </div>
          </div>
          <ol className="la-path">
            {m.lessons.map((l, li) => {
              const id = `${mi}-${li}`;
              n += 1;
              const done = progress.done.has(id);
              const now = progress.now === id;
              const tag = done ? null : now ? null : access ? access(id, n) : null;
              return (
                <li key={id}>
                  <Link className={"la-lesson" + (now ? " is-now" : "")} to={lessonHref(mi, li)} onClick={onNavigate}>
                    <span className={"la-node" + (done ? " is-done" : now ? " is-now" : "")} aria-hidden="true">
                      {done && <Check strokeWidth={3} />}
                    </span>
                    <span className="la-lesson-t">{l.title}</span>
                    {!compact && <span className="la-lesson-d">{l.description}</span>}
                    {done && (
                      <span className="la-lesson-m is-done">
                        <Check aria-hidden="true" />
                        Done
                      </span>
                    )}
                    {now && <span className="la-lesson-m is-now">Up next</span>}
                    {tag && <span className={"la-lesson-m" + ACCESS_TAG[tag].cls}>{ACCESS_TAG[tag].text}</span>}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      {review && (
        <div className="la-review-card">
          <span className="la-ico">
            <Flag aria-hidden="true" />
          </span>
          <div>
            <h3>End-of-course review</h3>
            <p>
              A short mixed quiz across all {course.modules.length} modules.
              {review.unlocked ? " Ready when you are." : ` It unlocks when the ${course.lessonCount} lessons are done.`}
            </p>
          </div>
          {review.unlocked ? (
            review.href ? (
              <Link className="la-btn la-btn-ink" to={review.href}>
                Start review
              </Link>
            ) : (
              <button className="la-btn la-btn-ink" type="button" onClick={review.onStart}>
                Start review
              </button>
            )
          ) : (
            <button className="la-btn la-btn-line" type="button" disabled>
              <Lock aria-hidden="true" />
              Locked
            </button>
          )}
        </div>
      )}
    </>
  );
}
