export const THANKS_WRITE_SECONDS = 3.2
export const THANKS_FADE_SECONDS = 0.65
export const THANKS_HOLD_SECONDS = 7
export const THANKS_GAP_SECONDS = 0.4
export const THANKS_CYCLE_SECONDS = THANKS_WRITE_SECONDS + THANKS_HOLD_SECONDS + THANKS_FADE_SECONDS + THANKS_GAP_SECONDS
export const THANKS_LINE_HEIGHT = 1.1

// The authoring file contains plain-text paragraphs, not executable HTML.
// Comments and optional Markdown headings are instructions, not messages.
export function parsePersonalThanks(markdown: string) {
  return markdown
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^#{1,6}[ \t]+.*$/gm, '')
    .split(/\n[ \t]*\n/)
    .map(paragraph => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function smooth(value: number) {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

export function personalThanksAt(seconds: number, count: number) {
  if (!count) return { index: -1, opacity: 0, reveal: 0 }
  if (seconds <= 0) return { index: 0, opacity: 0, reveal: 0 }
  const index = Math.floor(seconds / THANKS_CYCLE_SECONDS) % count
  const age = seconds % THANKS_CYCLE_SECONDS
  const reveal = Math.min(1, age / THANKS_WRITE_SECONDS)
  const opacity = 1 - smooth((age - THANKS_WRITE_SECONDS - THANKS_HOLD_SECONDS) / THANKS_FADE_SECONDS)
  return { index, opacity, reveal }
}

const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

// Keep whole lines intact so the font's kerning and handwriting remain the
// same throughout the reveal. Fit and rendering share exactly this wrapping.
export function wrapPersonalThanks(
  text: string,
  width: number,
  size: number,
  measure: (text: string, size: number) => number,
) {
  if (!text.trim()) return []
  const lines: string[] = []
  let line = ''
  for (const word of text.trim().split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (measure(candidate, size) <= width) {
      line = candidate
      continue
    }
    if (line) {
      lines.push(line)
      line = ''
    }
    for (const { segment } of graphemes.segment(word)) {
      if (line && measure(line + segment, size) > width) {
        lines.push(line)
        line = segment
      }
      else {
        line += segment
      }
    }
  }
  if (line) lines.push(line)
  return lines
}

// A single pen advances through each line in reading order, at a consistent
// horizontal speed. Short final lines take less time than full-width lines.
export function personalThanksLineReveals(progress: number, widths: number[]) {
  const amount = Math.max(0, Math.min(1, progress))
  if (amount === 0 || amount === 1) return widths.map(() => amount)
  const lengths = widths.map(width => Math.max(0, width))
  const distance = lengths.reduce((total, width) => total + width, 0) * amount
  let completed = 0
  return lengths.map(width => {
    const reveal = width ? Math.max(0, Math.min(1, (distance - completed) / width)) : 0
    completed += width
    return reveal
  })
}

// Measure at the loaded handwriting font. Long edits get smaller rather than
// moving the heading or growing into the photographs. Unbroken names/URLs can
// wrap between graphemes, never inside a combining mark or emoji sequence.
export function fitPersonalThanksFontSize(
  text: string,
  width: number,
  height: number,
  preferredSize: number,
  measure: (text: string, size: number) => number,
) {
  if (!text) return preferredSize
  function fits(size: number) {
    return wrapPersonalThanks(text, width, size, measure).length * size * THANKS_LINE_HEIGHT <= height
  }
  if (fits(preferredSize)) return preferredSize
  let low = 1
  let high = preferredSize
  for (let iteration = 0; iteration < 10; iteration++) {
    const middle = (low + high) / 2
    if (fits(middle)) low = middle
    else high = middle
  }
  return Math.floor(low * 4) / 4
}
