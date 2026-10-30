import { useEffect, useState, type ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { BookOpen, Check, Clock, ExternalLink, Image as ImageIcon, Quote, Sparkles, X } from "lucide-react";
import { searchPexelsImage } from "@/lib/ai.functions";
import { isV1, isV2, type AnyVisual, type RuleVisual, type VisualV1, type VisualV2 } from "./visuals.types";

export type { AnyVisual, VisualV2, VisualV1 } from "./visuals.types";

/* ---------- stage helpers (used by LessonPlayer and the gallery) ---------- */

/** Class list for the stage that holds this visual. v2 cards get `is-v2 la-v-<type>`; v1 visuals keep the plain stage. */
export function stageClass(visual: AnyVisual | null | undefined): string {
  if (isV2(visual)) {
    const titled = "title" in visual && typeof visual.title === "string" && visual.title.length > 0 && visual.type !== "icon" && visual.type !== "rule";
    return "la-stage is-v2 la-v2-" + visual.type + (titled ? " la-has-title" : "") + (visual.type === "photo" ? " has-img" : "");
  }
  return "la-stage" + (isV1(visual) && visual.kind === "image" ? " is-img" : "");
}

/** The caption under the stage: v2 photos (caption + credit) and v1 images. Other cards carry their caption inside. */
export function stageCaption(visual: AnyVisual | null | undefined): ReactNode {
  if (isV2(visual) && visual.type === "photo") {
    return (
      <>
        {visual.caption}
        {visual.credit && (
          <span>
            Photo:{" "}
            <a href={visual.credit.url} target="_blank" rel="noopener noreferrer">
              {visual.credit.provider}
            </a>{" "}
            · {visual.credit.photographer}
          </span>
        )}
      </>
    );
  }
  if (isV1(visual) && visual.kind === "image") return visual.data.caption ?? "";
  return null;
}

/** Kept for callers of the previous API. */
export function isFullBleed(visual: AnyVisual | null | undefined) {
  return (isV2(visual) && visual.type === "photo") || (isV1(visual) && visual.kind === "image");
}

/* ---------- shared pieces ---------- */

function LucideByName({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) {
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_m, _d, c: string) => c.toUpperCase());
  const Icon = ((LucideIcons as unknown as Record<string, LucideIcons.LucideIcon | undefined>)[pascal] ?? Sparkles) as LucideIcons.LucideIcon;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

function StockImage({ query, alt }: { query: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [errored, setErrored] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    setErrored(false);
    searchPexelsImage({ data: { query } })
      .then((res: { url?: string | null }) => {
        if (cancelled) return;
        if (res.url) setSrc(res.url);
        else setErrored(true);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);
  if (errored) return <div className="la-glow" aria-hidden="true" />;
  return src ? <img src={src} alt={alt} onError={() => setErrored(true)} /> : <div className="la-stage-skeleton" aria-hidden="true" />;
}

function fmt(n: number, unit?: string) {
  return String(Math.round(n * 100) / 100) + (unit ?? "");
}

/* ---------- the diagram library (reviewed templates; the model only picks anchors) ---------- */

const DIAGRAMS: Record<string, { svg: string; anchors: Record<string, { side: "l" | "r"; y: string }>; source: string }> = {
  "us-nutrition-facts": {
    svg: "<svg class=\"la-nf\" viewBox=\"0 0 240 280\" role=\"img\" aria-labelledby=\"la-nf-title\"><title id=\"la-nf-title\">Simplified U.S. Nutrition Facts label using the FDA sample values for frozen lasagna, with four numbered callouts</title><rect x=\".75\" y=\".75\" width=\"238.5\" height=\"278.5\" fill=\"#fff\" stroke=\"#111\" stroke-width=\"1.5\"/><g fill=\"#111\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"8\" y=\"30\" font-family=\"'Inter Tight', Inter, sans-serif\" font-size=\"27\" font-weight=\"800\" textLength=\"224\" lengthAdjust=\"spacingAndGlyphs\">Nutrition Facts</text><rect x=\"8\" y=\"36.5\" width=\"224\" height=\".8\"/><text x=\"8\" y=\"50\" font-size=\"10.5\">4 servings per container</text><text x=\"8\" y=\"65\" font-size=\"12.5\" font-weight=\"700\">Serving size</text><text x=\"232\" y=\"65\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"end\">1 cup</text><rect x=\"8\" y=\"71\" width=\"224\" height=\"8\"/><text x=\"8\" y=\"91\" font-size=\"9\" font-weight=\"700\">Amount per serving</text><text x=\"8\" y=\"114\" font-family=\"'Inter Tight', Inter, sans-serif\" font-size=\"23\" font-weight=\"800\">Calories</text><text x=\"232\" y=\"114\" font-family=\"'Inter Tight', Inter, sans-serif\" font-size=\"31\" font-weight=\"800\" text-anchor=\"end\">280</text><rect x=\"8\" y=\"119\" width=\"224\" height=\"4.5\"/><text x=\"232\" y=\"134\" font-size=\"9\" font-weight=\"700\" text-anchor=\"end\">% Daily Value*</text><rect x=\"8\" y=\"138\" width=\"224\" height=\".8\"/><text x=\"8\" y=\"150\" font-size=\"10.5\"><tspan font-weight=\"700\">Total Fat</tspan> 9g</text><text x=\"232\" y=\"150\" font-size=\"10.5\" font-weight=\"700\" text-anchor=\"end\">12%</text><rect x=\"8\" y=\"153.5\" width=\"224\" height=\".8\"/><text x=\"8\" y=\"165.5\" font-size=\"10.5\"><tspan font-weight=\"700\">Sodium</tspan> 850mg</text><text x=\"232\" y=\"165.5\" font-size=\"10.5\" font-weight=\"700\" text-anchor=\"end\">37%</text><rect x=\"8\" y=\"169\" width=\"224\" height=\".8\"/><text x=\"8\" y=\"181\" font-size=\"10.5\"><tspan font-weight=\"700\">Total Carbohydrate</tspan> 34g</text><text x=\"232\" y=\"181\" font-size=\"10.5\" font-weight=\"700\" text-anchor=\"end\">12%</text><rect x=\"8\" y=\"184.5\" width=\"224\" height=\".8\"/><text x=\"18\" y=\"196.5\" font-size=\"10.5\">Total Sugars 6g</text><rect x=\"28\" y=\"200\" width=\"204\" height=\".8\"/><text x=\"28\" y=\"212\" font-size=\"10.5\">Includes 0g Added Sugars</text><text x=\"232\" y=\"212\" font-size=\"10.5\" font-weight=\"700\" text-anchor=\"end\">0%</text><rect x=\"8\" y=\"215.5\" width=\"224\" height=\".8\"/><text x=\"8\" y=\"227.5\" font-size=\"10.5\"><tspan font-weight=\"700\">Protein</tspan> 15g</text><rect x=\"8\" y=\"232\" width=\"224\" height=\"7\"/><text font-size=\"7.4\"><tspan x=\"8\" y=\"250\">* The % Daily Value (DV) tells you how much a nutrient</tspan><tspan x=\"8\" y=\"259.5\">in a serving of food contributes to a daily diet. 2,000</tspan><tspan x=\"8\" y=\"269\">calories a day is used for general nutrition advice.</tspan></text></g></svg>",
    anchors: { "serving-size": { side: "l", y: "21.8%" }, calories: { side: "l", y: "37.5%" }, "added-sugars": { side: "l", y: "74.5%" }, "daily-value": { side: "r", y: "46.8%" } },
    source: "Sample values: U.S. FDA label for frozen lasagna",
  },
};

/* ---------- v2 cards ---------- */

function RuleCard({ v }: { v: RuleVisual }) {
  const lo = v.scale.min;
  const hi = v.scale.max;
  const span = hi - lo || 1;
  const unit = v.scale.unit ?? "";
  const pct = (x: number) => Math.max(0, Math.min(100, ((x - lo) / span) * 100));
  const zones = v.zones
    .map((z) => ({ from: z.from ?? lo, to: z.to ?? hi, label: z.label, tone: z.tone }))
    .sort((a, b) => a.from - b.from);
  const band: ReactNode[] = [];
  const legend: ReactNode[] = [];
  let cursor = lo;
  zones.forEach((z, i) => {
    if (z.from > cursor) band.push(<span key={"gap" + i} className="la-rl-z la-mid" style={{ "--w": pct(z.from) - pct(cursor) + "%" } as React.CSSProperties} />);
    const cls = z.tone === "good" ? "la-lo" : z.tone === "caution" ? "la-hi" : "la-mid";
    band.push(
      <span key={"z" + i} className={"la-rl-z " + cls} style={{ "--w": pct(z.to) - pct(z.from) + "%" } as React.CSSProperties}>
        {z.label}
      </span>,
    );
    if (cls !== "la-mid") legend.push(<span key={"l" + i} className={cls}>{z.label}</span>);
    cursor = z.to;
  });
  if (cursor < hi) band.push(<span key="tail" className="la-rl-z la-mid" style={{ "--w": pct(hi) - pct(cursor) + "%" } as React.CSSProperties} />);
  const ticks = Array.from({ length: 6 }, (_, t) => <span key={t}>{fmt(lo + (span * t) / 5, unit)}</span>);
  return (
    <>
      <div className="la-rl-head">
        <p className="la-v-title">{v.title}</p>
        {unit && <p className="la-rl-sub">scale in {unit}</p>}
      </div>
      <div className="la-rl-body la-v-body">
        <div className="la-rl-track">
          <div className="la-rl-band">{band}</div>
          {v.marker && (
            <div className="la-rl-pin" style={{ "--m": pct(v.marker.value) + "%" } as React.CSSProperties}>
              <span className="la-rl-pl">
                <b>{fmt(v.marker.value, unit)}</b>
                <span>{v.marker.label}</span>
              </span>
            </div>
          )}
        </div>
        <div className="la-rl-ticks" aria-hidden="true">
          {ticks}
        </div>
        <div className="la-rl-legend" aria-hidden="true">
          {legend}
        </div>
      </div>
    </>
  );
}

function V2({ v }: { v: VisualV2 }) {
  switch (v.type) {
    case "icon":
      return (
        <>
          <div className="la-ic-tile">
            <LucideByName name={v.icon} className="la-ico" strokeWidth={1.75} />
          </div>
          <p className="la-ic-title">{v.title}</p>
          <p className="la-ic-cap">{v.caption}</p>
        </>
      );
    case "compare": {
      const m = /^[x×](\d)$/.exec(v.relation ?? "");
      const n = m ? Number(m[1]) : 0;
      const draw = n >= 2 && n <= 6;
      const bars = (k: number) =>
        draw ? (
          <div className="la-cmp-bar" aria-hidden="true" style={{ "--n": n } as React.CSSProperties}>
            {Array.from({ length: n }, (_, i) => (
              <i key={i} className={i < k ? "la-on" : undefined} />
            ))}
          </div>
        ) : null;
      const side = (s: { label: string; value: string; unit?: string }) => (
        <>
          <p className="la-cmp-label">{s.label}</p>
          <p className="la-cmp-value">{s.value}</p>
          {s.unit && <p className="la-cmp-unit">{s.unit}</p>}
        </>
      );
      return (
        <div className="la-cmp">
          <div className="la-cmp-side">
            {side(v.left)}
            {bars(1)}
          </div>
          <div className="la-cmp-rel">{v.relation && <b>{v.relation}</b>}</div>
          <div className="la-cmp-side la-is-b">
            {side(v.right)}
            {bars(n)}
          </div>
        </div>
      );
    }
    case "steps":
      return (
        <>
          {v.title && <p className="la-v-title">{v.title}</p>}
          <ol className="la-st-list la-v-body" style={{ "--n": v.steps.length } as React.CSSProperties}>
            {v.steps.map((s, i) => (
              <li key={i}>
                <span className="la-st-n">{i + 1}</span>
                <span className="la-st-l">
                  {s.label}
                  {s.note && <small>{s.note}</small>}
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "stat":
      return (
        <>
          <div className="la-sx">
            <p className="la-sx-value">{v.value}</p>
            <p className="la-sx-unit">{v.unit}</p>
            {v.caption && <p className="la-sx-cap">{v.caption}</p>}
          </div>
          <a className="la-src" href={v.source.url} target="_blank" rel="noopener noreferrer">
            <span className="la-src-tag">
              <BookOpen className="la-ico" aria-hidden="true" />
              Source
            </span>
            <span className="la-src-text">
              <strong>{v.source.name}</strong>, <u>{v.source.title}</u>
            </span>
            <ExternalLink className="la-ico la-ext" aria-hidden="true" />
            <span className="la-sr-only">(opens in a new tab)</span>
          </a>
        </>
      );
    case "timeline":
      return (
        <>
          {v.title && <p className="la-v-title">{v.title}</p>}
          <ol className="la-tl-list la-v-body" style={{ "--n": v.events.length } as React.CSSProperties}>
            {v.events.map((ev, i) => (
              <li key={i} className={ev.duration ? "la-is-span" : undefined}>
                <span className="la-tl-dot" />
                <span className="la-tl-t">
                  {ev.label}
                  {ev.duration ? (
                    <small>
                      <Clock className="la-ico" aria-hidden="true" />
                      {ev.duration}
                    </small>
                  ) : (
                    ev.note && <small>{ev.note}</small>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "dodont": {
      const col = (cls: string, head: string, Icon: typeof Check, items: string[]) => (
        <div className={"la-dd-col " + cls}>
          <p className="la-dd-h">
            <span className="la-dd-i">
              <Icon className="la-ico" aria-hidden="true" />
            </span>
            {head}
          </p>
          <ul>
            {items.map((t, i) => (
              <li key={i}>
                <Icon className="la-ico" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      );
      return (
        <>
          {v.title && <p className="la-v-title">{v.title}</p>}
          <div className="la-dd-cols la-v-body">
            {col("la-is-do", "Do", Check, v.do)}
            {col("la-is-dont", "Don’t", X, v.dont)}
          </div>
        </>
      );
    }
    case "diagram": {
      const d = DIAGRAMS[v.template];
      if (!d) return null;
      const placed = v.callouts.map((c, i) => ({ c, a: d.anchors[c.anchor], n: i + 1 })).filter((x) => x.a);
      return (
        <>
          <div className="la-dg">
            <div className="la-dg-box">
              <span dangerouslySetInnerHTML={{ __html: d.svg }} />
              {placed.map(({ a, n }) => (
                <span key={n} className={"la-dg-m" + (a.side === "r" ? " la-r" : "")} style={{ "--x": a.side === "r" ? "100%" : "0%", "--y": a.y } as React.CSSProperties} aria-hidden="true">
                  {n}
                </span>
              ))}
            </div>
            <ol className="la-dg-calls">
              {placed.map(({ c, a, n }) => (
                <li key={n} className={a.side === "r" ? "la-r" : "la-l"} style={{ "--y": a.y } as React.CSSProperties} data-n={n}>
                  <b>{c.label}</b>
                  {c.note && <small>{c.note}</small>}
                </li>
              ))}
            </ol>
          </div>
          <p className="la-dg-src">{d.source}</p>
        </>
      );
    }
    case "definition": {
      const tm = /^(.*?)\s*(\([^)]*\))$/.exec(v.term);
      const on = v.meter && v.meter.max > 0 ? Math.max(1, Math.round((v.meter.value / v.meter.max) * 5)) : 0;
      return (
        <div className="la-df">
          <p className="la-v-eyebrow">Term</p>
          <p className="la-df-term">
            {tm ? (
              <>
                {tm[1]} <span>{tm[2]}</span>
              </>
            ) : (
              v.term
            )}
          </p>
          <p className="la-df-def">{v.definition}</p>
          {v.example && (
            <div className="la-df-ex">
              <p className="la-v-eyebrow">Example</p>
              <p className="la-df-ext">{v.example}</p>
              {on > 0 && (
                <div className="la-df-meter" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, k) => (
                    <i key={k} className={k < on ? "la-on" : undefined} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    case "rule":
      return <RuleCard v={v} />;
    case "photo":
      if (v.src) return <img src={v.src} alt={v.caption} />;
      return <StockImage query={v.query} alt={v.caption} />;
    default:
      return null;
  }
}

/* ---------- v1 fallback: cached lessons until they are backfilled (no charting library) ---------- */

function V1({ v }: { v: VisualV1 }) {
  switch (v.kind) {
    case "image":
      return v.data.query ? <StockImage query={v.data.query} alt={v.data.alt || v.data.query} /> : null;
    case "icon":
    case "emoji":
      return (
        <>
          <div className="la-glow" aria-hidden="true" />
          <div className="la-v-icon">
            <span className="la-tile-ico">{v.kind === "icon" ? <LucideByName name={v.data.name} strokeWidth={1.75} /> : <Sparkles strokeWidth={1.75} aria-hidden="true" />}</span>
            {v.kind === "icon" && v.data.label && <span className="la-v-label">{v.data.label}</span>}
            {v.data.caption && <span className="la-v-sub">{v.data.caption}</span>}
          </div>
        </>
      );
    case "stat":
      return (
        <>
          <div className="la-glow" aria-hidden="true" />
          <div className="la-v-stat">
            <div className="la-v-num">{String(v.data.value)}</div>
            <div className="la-v-label">{v.data.label}</div>
            {v.data.sublabel && <div className="la-v-sub">{v.data.sublabel}</div>}
          </div>
        </>
      );
    case "callout":
      return (
        <blockquote className="la-v-callout">
          <Quote className="la-q" aria-hidden="true" />
          <p>{v.data.text}</p>
        </blockquote>
      );
    case "comparison":
      return (
        <div className="la-v-cmp">
          <div className="la-tile">
            <p className="la-eyebrow">{v.data.left.label}</p>
            <p>{v.data.left.text}</p>
          </div>
          <div className="la-tile hi">
            <p className="la-eyebrow">{v.data.right.label}</p>
            <p>{v.data.right.text}</p>
          </div>
        </div>
      );
    case "steps":
      return (
        <ol className="la-v-steps">
          {v.data.items.map((item, i) => (
            <li key={i}>
              <b>{i + 1}</b>
              <span>{String(item)}</span>
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <div className="la-v-code">
          {v.data.caption && <div className="la-v-codebar">{v.data.caption}</div>}
          <pre>
            <code>{v.data.code}</code>
          </pre>
        </div>
      );
    case "chart": {
      const points = (v.data.points ?? []).filter((p) => p && typeof p.value === "number" && Number.isFinite(p.value));
      if (points.length === 0) return null;
      const max = Math.max(...points.map((p) => p.value)) || 1;
      return (
        <figure className="la-v-chart">
          {v.data.title && <p className="t">{v.data.title}</p>}
          <div className="la-bars" aria-hidden="true">
            {points.map((p, i) => (
              <i key={i} style={{ height: Math.round((p.value / max) * 100) + "%" }} title={p.label + ": " + p.value} />
            ))}
          </div>
          <div className="la-bar-labels">
            {points.map((p, i) => (
              <span key={i}>{p.label}</span>
            ))}
          </div>
          {v.data.caption && <figcaption className="la-v-sub">{v.data.caption}</figcaption>}
        </figure>
      );
    }
    case "timeline":
      return (
        <ol className="la-v-tl">
          {v.data.items.map((it, i) => (
            <li key={i}>
              <p className="la-eyebrow">{it.date}</p>
              <p className="t">{it.title}</p>
              {it.description && <p className="d">{it.description}</p>}
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

/** Renders one segment visual inside `.la-stage` (see LessonPlayer): v2 cards by `type`, cached v1 visuals by `kind`. */
export function SegmentVisualRenderer({ visual }: { visual: AnyVisual | null | undefined }) {
  if (isV2(visual)) return <V2 v={visual} />;
  if (isV1(visual)) return <V1 v={visual} />;
  return null;
}

/** Unused import guard for icons referenced only by name. */
void ImageIcon;
