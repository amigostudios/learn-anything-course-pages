import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { MyCourse } from "../course/types";

/**
 * "Continue learning": the signed-in user's own courses with progress, above the library grid.
 * Render it only when `courses` is non-empty. Courses without an image get a sky tile with their initial.
 */
export function ContinueStrip({ courses, allHref = "/" }: { courses: MyCourse[]; allHref?: string }) {
  if (courses.length === 0) return null;
  return (
    <section style={{ marginTop: 44 }}>
      <div className="la-sec-head">
        <h2>Continue learning</h2>
        <Link to={allHref}>
          All your courses <ArrowRight aria-hidden="true" strokeWidth={2.2} />
        </Link>
      </div>
      <div className="la-continue">
        {courses.map((c) => {
          const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
          return (
            <Link className="la-cont" to={c.href} key={c.href}>
              {c.image ? (
                <img src={c.image} alt="" />
              ) : (
                <span className="la-thumb" aria-hidden="true">
                  {c.title.charAt(0)}
                </span>
              )}
              <div>
                <h3>{c.title}</h3>
                <p>
                  {c.done > 0
                    ? `${c.done} of ${c.total} lessons done${c.next ? ` · next: ${c.next}` : ""}`
                    : `Not started · ${c.total} lessons`}
                </p>
                <div className="la-bar">
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
