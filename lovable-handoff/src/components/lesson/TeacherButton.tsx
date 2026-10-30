/** "Ask the teacher" pill with the orb. The label hides below 640px, leaving the orb as the button. */
export function TeacherButton({ onClick, label = "Ask the teacher" }: { onClick: () => void; label?: string }) {
  return (
    <button className="la-ask-btn" type="button" onClick={onClick} aria-label={label}>
      <span className="la-orb" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

/** Text link version used inside the quiz card. */
export function TeacherLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button className="la-qask" type="button" onClick={onClick}>
      <span className="la-orb" aria-hidden="true" />
      {children}
    </button>
  );
}
