// Example of how the lesson route composes the shell, the restyled player, the quiz and the complete view.
// Everything about data stays as it is today (generateLesson, the serial audio fetch, cacheLessonResources,
// markLessonComplete, AskTeacher). Only the rendering below the data layer changes.
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import "@/styles/courses.css";
import { LessonShell } from "@/components/lesson/LessonShell";
import { LessonPlayer, type LessonSegment } from "@/components/lesson/LessonPlayer";
import { SegmentProgress } from "@/components/lesson/SegmentProgress";
import { Quiz } from "@/components/lesson/Quiz";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { GenerationLoader } from "@/components/lesson/GenerationLoader";
import type { Course, ProgressState } from "@/components/course/types";
// import { AskTeacher, type AskTeacherHandle } from "@/components/AskTeacher";

export const Route = createFileRoute("/learn/$topicId/$lessonId")({
  component: LessonView,
  validateSearch: (search: Record<string, unknown>) => ({
    topic: (search.topic as string) || "",
    moduleTitle: (search.moduleTitle as string) || "",
    lessonTitle: (search.lessonTitle as string) || "",
  }),
});

function LessonView() {
  const { topicId, lessonId } = Route.useParams();
  const { topic, moduleTitle, lessonTitle } = Route.useSearch();

  // --- existing state, unchanged ---------------------------------------------------------------
  const isLoading = false;
  const lesson = null as null | { title: string; segments: LessonSegment[]; keyConcepts: { term: string; definition: string }[]; quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[] };
  const audioForPlayer: (string | null)[] = [];
  const timingsBySegment: (number[] | null)[] = [];
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [, setCurrentSegmentIndex] = useState(0);
  const askTeacherRef = useRef<{ open: () => void } | null>(null);

  // --- what the shell needs: the course outline and progress (both already cached for the course page) ---
  const course: Course = { slug: topicId, title: topic, description: "", level: "Beginner", lessonCount: 0, prerequisites: [], modules: [] };
  const progress: ProgressState = { done: new Set<string>(), now: lessonId };
  const [mi, li] = lessonId.split("-").map(Number);
  const lessonNumber = course.modules.slice(0, mi).reduce((n, m) => n + m.lessons.length, 0) + li + 1;
  const lessonHref = (m: number, l: number) => `/learn/${topicId}/${m}-${l}?topic=${encodeURIComponent(topic)}`;
  const courseHref = `/learn/${topicId}?topic=${encodeURIComponent(topic)}`;
  const nextLesson = (() => {
    const flat = course.modules.flatMap((m, a) => m.lessons.map((lsn, b) => ({ id: `${a}-${b}`, title: lsn.title })));
    const idx = flat.findIndex((x) => x.id === lessonId);
    const n = flat[idx + 1];
    return n ? { title: n.title, href: lessonHref(...(n.id.split("-").map(Number) as [number, number])) } : null;
  })();

  if (isLoading) {
    return <GenerationLoader title="Preparing your lesson" subtitle={`${lessonTitle} · about ten seconds`} steps={["Reading the lesson plan", "Writing the explanation", "Designing the visuals", "Preparing the narration"]} estimatedSeconds={10} />;
  }
  if (!lesson) return null; // keep the existing error view here

  return (
    <LessonShell
      course={course}
      progress={progress}
      moduleTitle={moduleTitle}
      lessonTitle={lesson.title}
      lessonNumber={lessonNumber}
      backHref={courseHref}
      lessonHref={lessonHref}
      onAskTeacher={() => askTeacherRef.current?.open()}
    >
      {quizScore !== null ? (
        <>
          <SegmentProgress total={lesson.segments.length} current={lesson.segments.length - 1} progress={1} type="complete" label={`Lesson ${lessonNumber} of ${course.lessonCount}`} allDone />
          <div className="la-lmain">
            <div className="la-lcol">
              <LessonComplete
                lessonTitle={lesson.title}
                score={quizScore}
                questionCount={lesson.quiz.length}
                doneCount={progress.done.size + 1}
                lessonCount={course.lessonCount}
                next={nextLesson}
                courseHref={courseHref}
                keyConcepts={lesson.keyConcepts}
              />
            </div>
          </div>
        </>
      ) : showQuiz ? (
        <>
          <SegmentProgress total={lesson.segments.length} current={lesson.segments.length - 1} progress={1} type="quiz" label="Check your understanding" allDone />
          <div className="la-lmain">
            <div className="la-lcol">
              <Quiz
                questions={lesson.quiz}
                onComplete={(score) => {
                  // markLessonComplete(topicId, lessonId);  — as today, but no redirect
                  setQuizScore(score ?? 0);
                }}
                onAskTeacher={(/* contextNote, firstMessage */) => askTeacherRef.current?.open()}
              />
            </div>
          </div>
        </>
      ) : (
        <LessonPlayer
          segments={lesson.segments}
          audioBySegment={audioForPlayer}
          wordTimingsBySegment={timingsBySegment}
          onComplete={() => setShowQuiz(true)}
          onSegmentChange={setCurrentSegmentIndex}
          keyConcepts={lesson.keyConcepts}
        />
      )}
      {/* <AskTeacher ref={askTeacherRef} … showMiniOrb={false} /> — the Ask button is in the top bar now */}
    </LessonShell>
  );
}
