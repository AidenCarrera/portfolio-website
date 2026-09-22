/**
 * Class strings shared across pages. Focus rings are not here: the global
 * `:focus-visible` rule in globals.css draws them for every control.
 */

/** Page-width column every section aligns to. */
export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const BUTTON_BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-out-expo active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

/** Dark text on the full brand: the old white-on-teal was under 3:1. */
export const BUTTON_PRIMARY = `${BUTTON_BASE} bg-brand text-ink-950 shadow-[0_0_0_1px_rgb(0_255_204/0.35),0_12px_40px_-12px_rgb(0_255_204/0.4)] hover:bg-[#6affdf] hover:shadow-[0_0_0_1px_rgb(0_255_204/0.6),0_16px_48px_-10px_rgb(0_255_204/0.5)]`;

export const BUTTON_SECONDARY = `${BUTTON_BASE} border border-line-strong bg-white/[0.03] text-white backdrop-blur-sm hover:border-brand/50 hover:bg-brand/[0.07]`;

/** Square icon control, e.g. a repository or live-site link on a card. */
export const ICON_BUTTON =
  "relative inline-flex size-9 items-center justify-center rounded-full border border-line bg-ink-900/60 text-slate-400 backdrop-blur-sm transition-colors duration-200 hover:border-brand/50 hover:text-brand";

/** Neutral technology/topic pill. */
export const CHIP =
  "inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.025] px-2 py-1 text-xs font-medium text-slate-300";

/** `CHIP` picked out in the brand, for highlighted items in a list. */
export const CHIP_ACCENT =
  "inline-flex items-center gap-1.5 rounded-md border border-brand/25 bg-brand/[0.08] px-2 py-1 text-xs font-medium text-brand-pale";

/** Brand-tinted pill for states such as Featured. */
export const CHIP_BRAND =
  "inline-flex items-center rounded-md border border-brand/25 bg-brand/[0.08] px-2 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-brand";

/** Blue for collaborative work, matching the LinkedIn/collab hue used before. */
export const CHIP_COLLAB =
  "inline-flex items-center rounded-md border border-sky-400/25 bg-sky-400/[0.08] px-2 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-sky-300";

/** Long-form rich text: CMS portable text and the policy page. */
export const PROSE =
  "space-y-5 text-[1.0625rem] leading-8 text-slate-300 [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand [&_blockquote]:border-l-2 [&_blockquote]:border-brand/50 [&_blockquote]:pl-5 [&_blockquote]:text-slate-400 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-brand-pale [&_h2]:pt-8 [&_h2]:text-[1.75rem] [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-[-0.03em] [&_h2]:text-white [&_h3]:pt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-white [&_li]:pl-1.5 [&_li]:marker:text-brand [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5";

export const INLINE_LINK =
  "rounded-sm font-medium text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-pale hover:decoration-brand";
