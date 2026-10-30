import type { ReactNode } from "react";
import { PlanetMark } from "@/components/site/PlanetMark";

/** "Ask the teacher" pill: the planet mark with a soft halo. The label hides below 640px, leaving the mark as the button. */
export function TeacherButton({ onClick, label = "Ask the teacher" }: { onClick: () => void; label?: string }) {
  return (
    <button className="la-ask-btn" type="button" onClick={onClick} aria-label={label}>
      <span className="la-ask-mark" aria-hidden="true">
        <PlanetMark size={28} tone="dark" />
      </span>
      <span>{label}</span>
    </button>
  );
}

/** Text link version used inside the quiz card. */
export function TeacherLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button className="la-qask" type="button" onClick={onClick}>
      <span className="la-ask-mark" aria-hidden="true">
        <PlanetMark size={24} tone="dark" />
      </span>
      {children}
    </button>
  );
}
