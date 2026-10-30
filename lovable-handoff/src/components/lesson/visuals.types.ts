/**
 * Lesson segment visuals.
 * v2 = the contract in /visuals/lesson-visual.v2.schema.json (keyed on `type`, ten card types).
 * v1 = what cached lessons still carry (keyed on `kind`, as the live SegmentVisual.tsx knows them).
 */
export interface IconVisual { type: "icon"; icon: string; title: string; caption: string }
export interface CompareSide { label: string; value: string; unit?: string }
export interface CompareVisual { type: "compare"; left: CompareSide; right: CompareSide; relation?: string }
export interface StepsVisual { type: "steps"; title?: string; steps: { label: string; note?: string }[] }
export interface StatVisual { type: "stat"; value: string; unit: string; caption?: string; source: { name: string; title: string; url: string } }
export interface TimelineVisual { type: "timeline"; title?: string; events: { label: string; note?: string; duration?: string }[] }
export interface DoDontVisual { type: "dodont"; title?: string; do: string[]; dont: string[] }
export interface DiagramVisual { type: "diagram"; template: "us-nutrition-facts"; callouts: { anchor: string; label: string; note?: string }[] }
export interface DefinitionVisual { type: "definition"; term: string; definition: string; example?: string; meter?: { value: number; max: number } }
export interface RuleZone { from?: number; to?: number; label: string; tone: "good" | "neutral" | "caution" }
export interface RuleVisual { type: "rule"; title: string; scale: { min: number; max: number; unit?: string }; zones: RuleZone[]; marker?: { value: number; label: string } }
export interface PhotoVisual {
  type: "photo";
  query: string;
  caption: string;
  reason: string;
  credit?: { provider: "Pexels"; photographer: string; url: string };
  /** Resolved image URL. Filled by the app when the photo is resolved at generation time; until then the renderer searches Pexels by `query`. */
  src?: string;
}
export type VisualV2 = IconVisual | CompareVisual | StepsVisual | StatVisual | TimelineVisual | DoDontVisual | DiagramVisual | DefinitionVisual | RuleVisual | PhotoVisual;
export type VisualType = VisualV2["type"];

export type SegmentKind = "intro" | "concept" | "process" | "stat" | "practice" | "anatomy" | "summary" | "real object";

/** v2 segment as the generator writes it. The live lesson store keeps `narration`; `body` is the same text under the v2 name. */
export interface SegmentV2 { kind: SegmentKind; heading: string; key_idea: string; body: string; visual: VisualV2 }

export type VisualV1 =
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

export type AnyVisual = VisualV2 | VisualV1;

export function isV2(v: unknown): v is VisualV2 {
  return !!v && typeof v === "object" && typeof (v as { type?: unknown }).type === "string" && !("kind" in (v as object));
}
export function isV1(v: unknown): v is VisualV1 {
  return !!v && typeof v === "object" && typeof (v as { kind?: unknown }).kind === "string";
}
