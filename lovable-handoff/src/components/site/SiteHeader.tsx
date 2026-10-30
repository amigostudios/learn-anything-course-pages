import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { PlanetMark } from "./PlanetMark";

type Props = {
  /** "sky" sits on the SkyBand (white text); "paper" is the same nav on a white page. */
  tone?: "sky" | "paper";
  /** Which link is the current page. */
  current?: "library" | "pricing" | "about";
  /** Signed-in user, or null for a visitor. */
  user?: { label: string } | null;
  /** Where "Start learning" goes. Defaults to the home page topic field. */
  startHref?: string;
};

/**
 * The home page nav, reused on every course page so the site has one header.
 * Same geometry as HomeNav: mark + name, three links, Account / Sign in, Start learning; a Menu panel below 860px.
 */
export function SiteHeader({ tone = "sky", current, user = null, startHref = "/#learn" }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [open]);

  const accountHref = user ? "/account" : "/auth";
  const accountLabel = user ? "Account" : "Sign in";

  return (
    <nav className={"la-nav la-wrap" + (tone === "paper" ? " is-paper" : "")} aria-label="Main">
      <Link className="la-brand" to="/">
        <PlanetMark size={28} tone={tone === "paper" ? "dark" : "light"} />
        <span>Learn Anything</span>
      </Link>
      <div className="la-nav-links">
        <Link to="/library" aria-current={current === "library" ? "page" : undefined}>
          Library
        </Link>
        <Link to="/pricing" aria-current={current === "pricing" ? "page" : undefined}>
          Pricing
        </Link>
        <Link to="/about" aria-current={current === "about" ? "page" : undefined}>
          About
        </Link>
      </div>
      <div className="la-nav-actions">
        <Link className="la-btn la-btn-ghost" to={accountHref}>
          {accountLabel}
        </Link>
        <a className="la-btn la-btn-white" href={startHref}>
          Start learning
        </a>
        <button
          ref={buttonRef}
          type="button"
          className="la-nav-menu"
          aria-expanded={open}
          aria-controls="la-menu-panel"
          onClick={() => setOpen((o) => !o)}
        >
          Menu <Menu size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div ref={panelRef} className="la-menu-panel" id="la-menu-panel">
          <Link to="/library" onClick={() => setOpen(false)}>
            Library
          </Link>
          <Link to="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to={accountHref} onClick={() => setOpen(false)}>
            {accountLabel}
          </Link>
          <a href={startHref} onClick={() => setOpen(false)}>
            Start learning
          </a>
        </div>
      )}
    </nav>
  );
}
