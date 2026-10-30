import { useState, type ReactNode } from "react";
import { LessonTopBar } from "./LessonTopBar";
import { LessonsDrawer } from "./LessonsDrawer";
import type { Course, ProgressState } from "../course/types";

type Props = {
  course: Course;
  progress: ProgressState;
  moduleTitle: string;
  lessonTitle: string;
  lessonNumber: number;
  backHref: string;
  lessonHref: (moduleIndex: number, lessonIndex: number) => string;
  onAskTeacher?: () => void;
  /** LessonPlayer, or the quiz / complete views wrapped in `.la-lmain > .la-lcol`. */
  children: ReactNode;
};

/**
 * The full-height frame around a lesson: top bar, the content (player or quiz), and the lessons drawer.
 * The player renders its own progress ticks and PlayerBar; the quiz and complete views do not.
 */
export function LessonShell({ course, progress, moduleTitle, lessonTitle, lessonNumber, backHref, lessonHref, onAskTeacher, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="la-app">
      <div className="la-lesson-shell">
        <LessonTopBar
          courseTitle={course.title}
          moduleTitle={moduleTitle}
          lessonTitle={lessonTitle}
          lessonNumber={lessonNumber}
          lessonCount={course.lessonCount}
          backHref={backHref}
          onOpenLessons={() => setDrawerOpen(true)}
          lessonsOpen={drawerOpen}
          onAskTeacher={onAskTeacher}
        />
        {children}
        <LessonsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} course={course} progress={progress} lessonNumber={lessonNumber} lessonHref={lessonHref} />
      </div>
    </div>
  );
}
