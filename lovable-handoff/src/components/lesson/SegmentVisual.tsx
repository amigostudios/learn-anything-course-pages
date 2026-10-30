import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Quote } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { searchPexelsImage } from "@/lib/ai.functions";

/* Same data shapes as the existing SegmentVisual.tsx: only the rendering changed. */
export type SegmentVisual =
  | { kind: "emoji"; data: { emoji: string; caption?: string } }
  | { kind: "callout"; data: { text: string } }
  | { kind: "code"; data: { language?: string; code: string; caption?: string } }
  | { kind: "comparison"; data: { left: { label: string; text: string }; right: { label: string; text: string } } }
  | { kind: "steps"; data: { items: string[] } }
  | { kind: "image"; data: { query: string; alt: string; caption?: string } }
  | { kind: "icon"; data: { name: string; label?: string; caption?: string } }
  | { kind: "stat"; data: { value: string; label: string; sublabel?: string } }
  | { kind: "chart"; data: { chartType: "bar" | "line" | "pie"; title?: string; caption?: string; points: { label: string; value: number }[] } }
  | { kind: "timeline"; data: { items: { date: string; title: string; description?: string }[] } };

const BLUE = "#0F62E6";
const CHART_COLORS = ["#0F62E6", "#2F7BFF", "#5A9DF7", "#8DB6FF", "#BFD9FF", "#DCE8FF"];
const TOOLTIP_STYLE = { background: "#fff", border: "1px solid #E2E8F4", borderRadius: 12, fontSize: 12, color: "#0B1733" };

/** True when the visual fills the stage edge to edge (the stage drops its padding and goes navy). */
export function isFullBleed(visual: SegmentVisual | null | undefined) {
  return visual?.kind === "image";
}

/** The caption shown under the stage for image visuals (other kinds carry their caption inside). */
export function stageCaption(visual: SegmentVisual | null | undefined) {
  return visual?.kind === "image" ? visual.data.caption ?? "" : "";
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

function isStr(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

/** Renders one segment visual in the new stage language. Wrap it in `.la-stage` (see LessonPlayer). */
export function SegmentVisualRenderer({ visual }: { visual: SegmentVisual }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = visual as any;
  if (!v || !v.kind || !v.data) return null;
  const d = v.data;

  switch (v.kind) {
    case "image":
      if (!isStr(d.query)) return null;
      return <StockImage query={d.query} alt={d.alt || d.query} />;

    case "icon": {
      if (!isStr(d.name)) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Icon = ((LucideIcons as any)[d.name] || LucideIcons.Sparkles) as LucideIcons.LucideIcon;
      return (
        <>
          <div className="la-glow" aria-hidden="true" />
          <div className="la-v-icon">
            <span className="la-tile-ico">
              <Icon strokeWidth={1.75} aria-hidden="true" />
            </span>
            {d.label && <span className="la-v-label">{d.label}</span>}
            {d.caption && <span className="la-v-sub">{d.caption}</span>}
          </div>
        </>
      );
    }

    case "emoji":
      if (!isStr(d.emoji)) return null;
      return (
        <>
          <div className="la-glow" aria-hidden="true" />
          <div className="la-v-emoji">
            <span className="la-emoji" aria-hidden="true">
              {d.emoji}
            </span>
            {d.caption && <span className="la-v-sub">{d.caption}</span>}
          </div>
        </>
      );

    case "stat":
      if (!isStr(d.value) && typeof d.value !== "number") return null;
      if (!isStr(d.label)) return null;
      return (
        <>
          <div className="la-glow" aria-hidden="true" />
          <div className="la-v-stat">
            <div className="la-v-num">{String(d.value)}</div>
            <div className="la-v-label">{d.label}</div>
            {d.sublabel && <div className="la-v-sub">{d.sublabel}</div>}
          </div>
        </>
      );

    case "callout":
      if (!isStr(d.text)) return null;
      return (
        <blockquote className="la-v-callout">
          <Quote className="la-q" aria-hidden="true" />
          <p>{d.text}</p>
        </blockquote>
      );

    case "comparison":
      if (!d.left || !d.right || !isStr(d.left.label) || !isStr(d.left.text) || !isStr(d.right.label) || !isStr(d.right.text)) return null;
      return (
        <div className="la-v-cmp">
          <div className="la-tile">
            <p className="la-eyebrow">{d.left.label}</p>
            <p>{d.left.text}</p>
          </div>
          <div className="la-tile hi">
            <p className="la-eyebrow">{d.right.label}</p>
            <p>{d.right.text}</p>
          </div>
        </div>
      );

    case "steps":
      if (!Array.isArray(d.items) || d.items.length === 0) return null;
      return (
        <ol className="la-v-steps">
          {d.items.map((item: string, i: number) => (
            <li key={i}>
              <b>{i + 1}</b>
              <span>{String(item)}</span>
            </li>
          ))}
        </ol>
      );

    case "code":
      if (!isStr(d.code)) return null;
      return (
        <div className="la-v-code">
          {d.caption && <div className="la-v-codebar">{d.caption}</div>}
          <pre>
            <code>{d.code}</code>
          </pre>
        </div>
      );

    case "chart": {
      if (!Array.isArray(d.points) || d.points.length === 0) return null;
      const points = d.points.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => p && isStr(p.label) && typeof p.value === "number" && Number.isFinite(p.value),
      ) as { label: string; value: number }[];
      if (points.length === 0) return null;
      const chartType = ["bar", "line", "pie"].includes(d.chartType) ? d.chartType : "bar";
      const data = points.map((p) => ({ name: p.label, value: p.value }));
      return (
        <figure className="la-v-chart">
          {d.title && <p className="t">{d.title}</p>}
          <div style={{ height: 200, width: "100%", marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F4" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} stroke="#93A0BC" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="#93A0BC" tickLine={false} axisLine={false} width={32} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#F4F7FD" }} />
                  <Bar dataKey="value" fill={BLUE} radius={[6, 6, 2, 2]} />
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F4" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} stroke="#93A0BC" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="#93A0BC" tickLine={false} axisLine={false} width={32} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="value" stroke={BLUE} strokeWidth={2.5} dot={{ fill: BLUE, strokeWidth: 0, r: 4 }} />
                </LineChart>
              ) : (
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={44} paddingAngle={2} label={{ fontSize: 11, fill: "#55637F" }}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
          {d.caption && <figcaption className="la-v-sub">{d.caption}</figcaption>}
        </figure>
      );
    }

    case "timeline": {
      if (!Array.isArray(d.items) || d.items.length === 0) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = d.items.filter((it: any) => it && isStr(it.title)) as { date: string; title: string; description?: string }[];
      if (items.length === 0) return null;
      return (
        <ol className="la-v-tl">
          {items.map((it, i) => (
            <li key={i}>
              <p className="la-eyebrow">{it.date}</p>
              <p className="t">{it.title}</p>
              {it.description && <p className="d">{it.description}</p>}
            </li>
          ))}
        </ol>
      );
    }

    default:
      return null;
  }
}
