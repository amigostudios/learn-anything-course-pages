import { useEffect, useRef } from "react";

/**
 * Canvas starfield for the sky areas.
 * - seeded stars in three depths, slow drift, twinkle, a few flare stars, soft bokeh orbs
 * - "hero": shooting star every 7-15 s and pointer parallax on fine pointers
 * - "band": denser, calmer, no shooting star
 * - "page": the sky band at the top of the library and course pages; stars fade out toward the band's foot
 * - pauses when offscreen or the tab is hidden; prefers-reduced-motion draws one still frame
 * Size it with CSS (position:absolute; inset:0; width:100%; height:100%). The parent clips it.
 */

type Variant = "hero" | "band" | "page";
type Props = { variant?: Variant; className?: string };

type Star = { x: number; y: number; depth: number; r: number; ph: number; sp: number; big: boolean; vy: number };
type Orb = { x: number; y: number; r: number; a: number; vy: number; ph: number };
type Shot = { x0: number; y0: number; dx: number; dy: number; v: number; len: number; life: number; t0: number };

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Starfield({ variant = "hero", className = "la-stars" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const hero = variant === "hero";
    const cfg =
      variant === "hero"
        ? { density: 5200, field: 0.7, fadeFrom: 0.4, fadeTo: 0.66, orbs: 14, shooting: true, seed: 7, drift: 1 }
        : variant === "page"
          ? { density: 6500, field: 1, fadeFrom: 0.62, fadeTo: 1.05, orbs: 6, shooting: false, seed: 11, drift: 0.6 }
          : { density: 7000, field: 1, fadeFrom: 1.1, fadeTo: 1.2, orbs: 6, shooting: false, seed: 11, drift: 0.6 };

    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let orbs: Orb[] = [];
    let shot: Shot | null = null;
    let nextShot = 6;
    let raf = 0;
    let visible = true;
    let last = 0;
    const par = { x: 0, y: 0, tx: 0, ty: 0 };

    const seed = () => {
      const rnd = mulberry32(cfg.seed);
      const n = Math.min(420, Math.round((W * H * cfg.field) / cfg.density));
      stars = [];
      for (let i = 0; i < n; i++) {
        const d = Math.pow(rnd(), 1.6);
        stars.push({
          x: rnd() * W,
          y: rnd() * H * cfg.field,
          depth: d,
          r: 0.45 + d * 1.35,
          ph: rnd() * 6.283,
          sp: 0.5 + rnd() * 1.3,
          big: rnd() < 0.07,
          vy: (0.6 + d * 1.6) * cfg.drift,
        });
      }
      orbs = [];
      for (let i = 0; i < cfg.orbs; i++) {
        orbs.push({ x: rnd() * W, y: rnd() * H * cfg.field, r: 2.5 + rnd() * 4.5, a: 0.06 + rnd() * 0.14, vy: -(2 + rnd() * 4), ph: rnd() * 6.283 });
      }
    };

    // vertical alpha falloff: stars fade out where the sky turns pale
    const fade = (y: number) => {
      const a = cfg.fadeFrom * H;
      const b = cfg.fadeTo * H;
      if (y <= a) return 1;
      if (y >= b) return 0;
      const t = (y - a) / (b - a);
      return 1 - t * t * (3 - 2 * t);
    };

    const draw = (t: number, dt: number) => {
      const px = par.x;
      const py = par.y;
      ctx.clearRect(0, 0, W, H);

      for (const o of orbs) {
        if (!reduceMotion) {
          o.y += o.vy * dt;
          if (o.y < -20) {
            o.y = H * cfg.field + 10;
            o.x = Math.random() * W;
          }
        }
        const f = fade(o.y);
        if (f <= 0) continue;
        const a = o.a * f * (0.7 + 0.3 * Math.sin(t * 0.6 + o.ph));
        const x = o.x + px * 30;
        const y = o.y + py * 30;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r * 3);
        g.addColorStop(0, `rgba(190,215,255,${a})`);
        g.addColorStop(1, "rgba(190,215,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, o.r * 3, 0, 6.283);
        ctx.fill();
      }

      for (const s of stars) {
        if (!reduceMotion) {
          s.y += s.vy * dt;
          if (s.y > H * cfg.field + 4) {
            s.y = -4;
            s.x = Math.random() * W;
          }
        }
        const f = fade(s.y);
        if (f <= 0) continue;
        const tw = reduceMotion ? 0.85 : 0.62 + 0.38 * Math.sin(t * s.sp + s.ph);
        const a = f * tw * (0.35 + 0.65 * s.depth);
        const x = s.x + px * (4 + s.depth * 14);
        const y = s.y + py * (4 + s.depth * 14);
        if (s.big) {
          const gr = s.r * 7;
          const g = ctx.createRadialGradient(x, y, 0, x, y, gr);
          g.addColorStop(0, `rgba(255,255,255,${0.55 * a})`);
          g.addColorStop(0.3, `rgba(200,222,255,${0.18 * a})`);
          g.addColorStop(1, "rgba(200,222,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, gr, 0, 6.283);
          ctx.fill();
          ctx.strokeStyle = `rgba(255,255,255,${0.5 * a})`;
          ctx.lineWidth = 0.8;
          const L = s.r * 5 * (0.8 + 0.4 * tw);
          ctx.beginPath();
          ctx.moveTo(x - L, y);
          ctx.lineTo(x + L, y);
          ctx.moveTo(x, y - L);
          ctx.lineTo(x, y + L);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, 6.283);
        ctx.fill();
      }

      if (cfg.shooting && !reduceMotion) {
        if (!shot && t > nextShot) {
          const right = Math.random() < 0.5;
          const ang = ((20 + Math.random() * 18) * Math.PI) / 180;
          shot = {
            x0: W * (0.15 + Math.random() * 0.7),
            y0: H * (0.04 + Math.random() * 0.26),
            dx: Math.cos(ang) * (right ? 1 : -1),
            dy: Math.sin(ang),
            v: 820 + Math.random() * 300,
            len: 120 + Math.random() * 70,
            life: 0.5 + Math.random() * 0.2,
            t0: t,
          };
        }
        if (shot) {
          const age = t - shot.t0;
          if (age > shot.life) {
            shot = null;
            nextShot = t + 7 + Math.random() * 8;
          } else {
            const env = Math.sin((Math.PI * age) / shot.life);
            const hx = shot.x0 + shot.dx * shot.v * age;
            const hy = shot.y0 + shot.dy * shot.v * age;
            const L = shot.len * Math.min(1, age / 0.18);
            const tx = hx - shot.dx * L;
            const ty = hy - shot.dy * L;
            const g = ctx.createLinearGradient(tx, ty, hx, hy);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(1, `rgba(255,255,255,${0.9 * env})`);
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(hx, hy);
            ctx.stroke();
            const h = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
            h.addColorStop(0, `rgba(255,255,255,${0.7 * env})`);
            h.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = h;
            ctx.beginPath();
            ctx.arc(hx, hy, 9, 0, 6.283);
            ctx.fill();
          }
        }
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0, 0);
    };

    const frame = (now: number) => {
      raf = 0;
      const t = now / 1000;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      par.x += (par.tx - par.x) * 0.04;
      par.y += (par.ty - par.y) * 0.04;
      draw(t, dt);
      if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !reduceMotion && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointer = (e: PointerEvent) => {
      par.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      par.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
    if (ro) ro.observe(canvas);
    else window.addEventListener("resize", resize);
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
            if (visible) start();
            else stop();
          })
        : null;
    io?.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    if (hero && finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      stop();
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [variant]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
