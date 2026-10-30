import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { TeacherLink } from "./TeacherButton";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  /** Called when the last question is answered and "Finish lesson" is pressed; receives the score. */
  onComplete: (score?: number) => void;
  /** Called with a contextual note describing the current question state. */
  onAskTeacher?: (contextNote: string, firstMessage: string) => void;
}

/**
 * Restyled quiz, same props as before (onComplete now also receives the score).
 * One question card at a time: lettered options, correct / incorrect states, the explanation, next.
 * It does not render a "Quiz complete" card any more: the route shows LessonComplete instead of redirecting.
 */
export function Quiz({ questions, onComplete, onAskTeacher }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[currentIndex];
  if (!current) return null;
  const isWrong = showResult && selectedAnswer !== null && selectedAnswer !== current.correctIndex;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === current.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete(score);
    }
  };

  const askAboutCurrent = () => {
    if (!onAskTeacher) return;
    const userAnswerLetter = selectedAnswer !== null ? String.fromCharCode(65 + selectedAnswer) : "(none)";
    const correctLetter = String.fromCharCode(65 + current.correctIndex);
    const note = `The student is on a quiz question and may want help. Question: "${current.question}". Options: ${current.options
      .map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`)
      .join("; ")}. Correct answer: ${correctLetter} ("${current.options[current.correctIndex]}"). The student answered: ${userAnswerLetter}${
      selectedAnswer !== null ? ` ("${current.options[selectedAnswer]}")` : ""
    }. Explanation given: "${current.explanation}". Briefly clarify the misconception or answer their follow-up.`;
    const firstMessage = isWrong
      ? `Not quite — let's unpack why ${correctLetter} is the right answer. What part is tripping you up?`
      : `Happy to dig into this question. What would you like me to clarify?`;
    onAskTeacher(note, firstMessage);
  };

  return (
    <section className="la-qcard" aria-live="polite" key={currentIndex}>
      <div className="la-qhead">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="la-qdots" aria-hidden="true">
          {questions.map((_, i) => (
            <i key={i} className={i < currentIndex ? "is-done" : i === currentIndex ? "is-now" : ""} />
          ))}
        </span>
      </div>
      <h2 className="la-q">{current.question}</h2>
      <div className={"la-opts" + (showResult ? " is-answered" : "")}>
        {current.options.map((option, i) => {
          const state = showResult && i === current.correctIndex ? " is-correct" : showResult && i === selectedAnswer ? " is-wrong" : "";
          return (
            <button key={i} type="button" className={"la-opt" + state} onClick={() => handleSelect(i)} disabled={showResult}>
              <b>{String.fromCharCode(65 + i)}</b>
              <span>{option}</span>
              <Check aria-hidden="true" />
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className={"la-why" + (isWrong ? "" : " is-good")}>
          <b>{isWrong ? "Not quite." : "Correct."}</b>
          {current.explanation}
        </div>
      )}
      <div className="la-qactions">
        {onAskTeacher ? <TeacherLink onClick={askAboutCurrent}>Stuck? Ask the teacher</TeacherLink> : <span />}
        {showResult && (
          <button type="button" className="la-btn la-btn-ink la-btn-lg" onClick={handleNext} autoFocus>
            {isLast ? "Finish lesson" : "Next question"}
            <ArrowRight aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
