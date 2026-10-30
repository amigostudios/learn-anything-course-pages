import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CourseOutline } from "../course/CourseOutline";
import type { Course, ProgressState } from "../course/types";

type Props = {
  open: boolean;
  onClose: () => void;
  course: Course;
  progress: ProgressState;
  lessonNumber: number;
  lessonHref: (moduleIndex: number, lessonIndex: number) => string;
};

/**
 * The course outline beside the lesson: a right-hand panel on desktop, a bottom sheet on phones.
 * Escape and the scrim close it; focus moves to the close button when it opens.
 */
export function LessonsDrawer({ open, onClose, course, progress, lessonNumber, lessonHref }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const done = progress.done.size;
  const pct = course.lessonCount ? Math.round((done / course.lessonCount) * 100) : 0;
  return (
    <div className="la-drawer" id="la-drawer">
      <div className="la-scrim" onClick={onClose} />
      <div className="la-dpanel" role="dialog" aria-modal="true" aria-label="Lessons in this course">
        <div className="la-dhead">
          <div>
            <h2>{course.title}</h2>
            <p>
              Lesson {lessonNumber} of {course.lessonCount} · {done ? `${done} done` : "nothing finished yet"}
            </p>
            <div className="la-bar">
              <i style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button ref={closeRef} className="la-iconbtn" type="button" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="la-dbody">
          <CourseOutline course={course} progress={progress} lessonHref={lessonHref} compact onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
