import { Link } from "@tanstack/react-router";
import { ChevronLeft, Info, List } from "lucide-react";
import { TeacherButton } from "./TeacherButton";

type Props = {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonNumber: number;
  lessonCount: number;
  /** Route back to the course page. */
  backHref: string;
  onOpenLessons: () => void;
  lessonsOpen: boolean;
  onAskTeacher?: () => void;
};

/** Compact white bar for the lesson: back, course · module, "Lesson n of N  Title", Lessons, Ask the teacher. */
export function LessonTopBar({
  courseTitle,
  moduleTitle,
  lessonTitle,
  lessonNumber,
  lessonCount,
  backHref,
  onOpenLessons,
  lessonsOpen,
  onAskTeacher,
}: Props) {
  return (
    <header className="la-lbar">
      <div className="la-lbar-left">
        <Link className="la-iconbtn" to={backHref} aria-label="Back to course">
          <ChevronLeft aria-hidden="true" />
        </Link>
        <div className="la-lbar-title">
          <div className="la-lbar-course">
            {courseTitle} · {moduleTitle}
          </div>
          <div className="la-lbar-lesson">
            <small>
              Lesson {lessonNumber} of {lessonCount}
            </small>
            {lessonTitle}
          </div>
        </div>
      </div>
      <div className="la-lbar-right">
        <span className="la-ai-note">
          <Info aria-hidden="true" />
          AI-generated · verify anything you’d act on
        </span>
        <button className="la-pillbtn" type="button" aria-expanded={lessonsOpen} aria-controls="la-drawer" onClick={onOpenLessons}>
          <List aria-hidden="true" />
          <span>Lessons</span>
        </button>
        {onAskTeacher && <TeacherButton onClick={onAskTeacher} />}
      </div>
    </header>
  );
}
