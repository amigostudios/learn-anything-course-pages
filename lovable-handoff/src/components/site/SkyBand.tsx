import type { ReactNode } from "react";
import { Starfield } from "./Starfield";

/**
 * The night-sky band at the top of the library and course pages: the same colour field, light from above
 * and starfield as the home hero, at page-top height. Put the SiteHeader (tone "sky") and the page title
 * inside it; the white page follows.
 */
export function SkyBand({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header className={"la-band" + (className ? " " + className : "")}>
      <div className="la-sky" aria-hidden="true">
        <div className="la-sky-light" />
        <Starfield variant="page" />
      </div>
      {children}
    </header>
  );
}
