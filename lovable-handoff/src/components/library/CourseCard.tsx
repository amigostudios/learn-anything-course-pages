import { Link } from "@tanstack/react-router";
import { Clock, Layers } from "lucide-react";
import type { LibraryCourse } from "../course/types";

/** The live course page describes length as sittings; a sitting is about three lessons. */
export function sittings(lessons: number) {
  return Math.max(1, Math.ceil(lessons / 3));
}

/**
 * Library course card. Image, title, two-line description, lessons · sittings · level.
 * Below 640px the CSS turns it into a 92px row (thumbnail left) so a phone shows six courses per screen.
 * `compact` drops the description (used in the "Related courses" scroller).
 */
export function CourseCard({ course, compact = false }: { course: LibraryCourse; compact?: boolean }) {
  return (
    <Link className="la-card" to={course.href}>
      {course.image ? (
        <img className="la-card-img" src={course.image} alt="" loading="lazy" />
      ) : (
        <div className="la-card-img" aria-hidden="true" />
      )}
      <div className="la-card-body">
        <h3>{course.title}</h3>
        {!compact && <p>{course.description}</p>}
        <div className="la-card-meta">
          <span>
            <Layers aria-hidden="true" />
            {course.lessons} lessons
          </span>
          <span>
            <Clock aria-hidden="true" />
            {sittings(course.lessons)} sittings
          </span>
          <span className="la-level">{course.level}</span>
        </div>
      </div>
    </Link>
  );
}
