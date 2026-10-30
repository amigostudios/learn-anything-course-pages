import { useId } from "react";

type Props = { size?: number; tone?: "light" | "dark"; className?: string };

/** The ring-planet mark. "light" is the white-on-sky version for the hero nav, "dark" the ink version for light backgrounds. */
export function PlanetMark({ size = 28, tone = "light", className }: Props) {
  const clipId = "la-mark-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ring = tone === "light" ? "rgba(255,255,255,.72)" : "#8DB6FF";
  const planet = tone === "light" ? "#fff" : "#0F62E6";
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className={className}>
      <defs>
        <clipPath id={clipId}>
          <rect x="-20" y="32" width="104" height="60" />
        </clipPath>
      </defs>
      <g transform="rotate(-18 32 32)">
        <ellipse cx="32" cy="32" rx="27" ry="8" fill="none" stroke={ring} strokeWidth="3.2" />
      </g>
      <circle cx="32" cy="32" r="15" fill={planet} />
      <g transform="rotate(-18 32 32)" clipPath={`url(#${clipId})`}>
        <ellipse cx="32" cy="32" rx="27" ry="8" fill="none" stroke={ring} strokeWidth="3.2" />
        <circle cx="8.6" cy="36" r="3.2" fill="#F2A14F" stroke="#fff" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
