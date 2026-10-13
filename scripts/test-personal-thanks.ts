import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { parseSlide, parseSync } from '@slidev/parser'
import {
  fitPersonalThanksFontSize,
  parsePersonalThanks,
  personalThanksAt,
  personalThanksLineReveals,
  THANKS_CYCLE_SECONDS,
  THANKS_FADE_SECONDS,
  THANKS_GAP_SECONDS,
  THANKS_HOLD_SECONDS,
  THANKS_WRITE_SECONDS,
  wrapPersonalThanks,
} from '../components/personal-thanks.ts'

test('blank lines separate paragraphs, while soft-wrapped lines remain together', () => {
  assert.deepEqual(parsePersonalThanks('To my mom,\nfor always being there...\n\nTo Katja, for her guidance...'), [
    'To my mom, for always being there...',
    'To Katja, for her guidance...',
  ])
})

test('authoring comments, optional headings, a BOM, and Windows line endings are ignored', () => {
  const markdown = '\uFEFF# Personal thanks\r\n\r\n<!-- Instructions\r\n\r\nnot a message. -->\r\n\r\nTo Yamina Silva...\r\n\r\n## More people\r\n\r\nTo Clairy...\r\n'
  assert.deepEqual(parsePersonalThanks(markdown), ['To Yamina Silva...', 'To Clairy...'])
})

test('personal wording, punctuation, and non-ASCII names are preserved', () => {
  const text = 'To José and Katja — “thank you”...'
  assert.deepEqual(parsePersonalThanks(text), [text])
  assert.deepEqual(parsePersonalThanks('<script>alert("hello")</script>'), ['<script>alert("hello")</script>'])
})

test('inline authoring comments do not split a message into separate entries', () => {
  assert.deepEqual(parsePersonalThanks('To my mom, <!-- private note --> for always being there...'), [
    'To my mom, for always being there...',
  ])
})

test('an empty authoring file produces no messages and a safe clock state', () => {
  assert.deepEqual(parsePersonalThanks('  \n<!-- Only instructions. -->\n\n# Personal thanks\n'), [])
  assert.deepEqual(personalThanksAt(40, 0), { index: -1, opacity: 0, reveal: 0 })
})

test('messages write on, hold for seven seconds, then fade away before the next', () => {
  assert.equal(THANKS_HOLD_SECONDS, 7)
  assert.deepEqual(personalThanksAt(-1, 4), { index: 0, opacity: 0, reveal: 0 })
  assert.deepEqual(personalThanksAt(THANKS_WRITE_SECONDS / 2, 4), { index: 0, opacity: 1, reveal: 0.5 })
  assert.deepEqual(personalThanksAt(THANKS_WRITE_SECONDS, 4), { index: 0, opacity: 1, reveal: 1 })
  assert.equal(personalThanksAt(THANKS_WRITE_SECONDS + THANKS_HOLD_SECONDS - 1e-6, 4).opacity, 1)
  const fading = personalThanksAt(THANKS_WRITE_SECONDS + THANKS_HOLD_SECONDS + THANKS_FADE_SECONDS / 2, 4)
  assert.ok(Math.abs(fading.opacity - 0.5) < 1e-10)
  assert.equal(fading.reveal, 1)
  assert.equal(personalThanksAt(THANKS_CYCLE_SECONDS - THANKS_GAP_SECONDS / 2, 4).opacity, 0)
  assert.deepEqual(personalThanksAt(THANKS_CYCLE_SECONDS, 4), { index: 1, opacity: 1, reveal: 0 })
})

test('every message appears in file order before the sequence repeats', () => {
  for (const count of [1, 4, 5, 20]) {
    const indices = Array.from({ length: count }, (_, index) =>
      personalThanksAt(index * THANKS_CYCLE_SECONDS + 1, count).index)
    assert.deepEqual(indices, Array.from({ length: count }, (_, index) => index))
    assert.equal(personalThanksAt(count * THANKS_CYCLE_SECONDS + 1, count).index, 0)
  }
})

const closePath = fileURLToPath(new URL('../sections/close.md', import.meta.url))
const closeSlides = parseSync(readFileSync(closePath, 'utf8'), closePath).slides
// The heading is author-editable; locate the slide by its component instead.
const thanksSlide = closeSlides.find(slide => /<ThankYouPhotos\b/.test(slide.content))

test('the closing slide supplies messages without a hardcoded list or count', () => {
  assert.ok(thanksSlide)
  assert.equal(typeof thanksSlide.frontmatter.personalThanks, 'string')
  const messages = parsePersonalThanks(thanksSlide.frontmatter.personalThanks)
  const visited = messages.map((_, index) => personalThanksAt(index * THANKS_CYCLE_SECONDS + 1, messages.length).index)
  assert.equal(new Set(visited).size, messages.length)
})

test('the acknowledgment component receives the closing slide frontmatter directly', () => {
  assert.ok(thanksSlide)
  assert.equal(typeof thanksSlide.frontmatter.title, 'string')
  assert.equal(typeof thanksSlide.frontmatter.subtitle, 'string')
  assert.match(thanksSlide.content, /<ThankYouPhotos\b[^>]*:title=["']\$frontmatter\.title["']/)
  assert.match(thanksSlide.content, /<ThankYouPhotos\b[^>]*:subtitle=["']\$frontmatter\.subtitle["']/)
  assert.match(thanksSlide.content, /<ThankYouPhotos\b[^>]*:personal-thanks=["']\$frontmatter\.personalThanks["']/)
})

test('the visible heading and subtitle use passed text rather than hardcoded copy', () => {
  const component = readFileSync(new URL('../components/ThankYouPhotos.vue', import.meta.url), 'utf8')
  assert.match(component, /<h1\b[^>]*>\s*\{\{\s*props\.title\s*\}\}\s*<\/h1>/)
  assert.match(component, /<p\b[^>]*class="thank-you-subtitle"[^>]*>\s*\{\{\s*props\.subtitle\s*\}\}\s*<\/p>/)
})

test('Slidev literal frontmatter preserves paragraphs, soft wraps, and personal wording', () => {
  const slide = parseSlide(`---
layout: none
title: Gracias a todos
subtitle: for making this possible
personalThanks: |
  To José, for always
  being there...

  To Katja: thank you for your guidance...
---

<ThankYouPhotos :title="$frontmatter.title" :subtitle="$frontmatter.subtitle" :personal-thanks="$frontmatter.personalThanks" />`)
  assert.equal(slide.frontmatter.title, 'Gracias a todos')
  assert.equal(slide.frontmatter.subtitle, 'for making this possible')
  assert.deepEqual(parsePersonalThanks(slide.frontmatter.personalThanks), [
    'To José, for always being there...',
    'To Katja: thank you for your guidance...',
  ])
})

const measure = (text: string, size: number) => Array.from(text).length * size * 0.5

test('whole words wrap into fixed lines before the reveal begins', () => {
  assert.deepEqual(wrapPersonalThanks('To my mom, for always being there...', 100, 20, measure), [
    'To my mom,', 'for always', 'being', 'there...',
  ])
  assert.deepEqual(wrapPersonalThanks('', 100, 20, measure), [])
  assert.deepEqual(wrapPersonalThanks('LongName'.repeat(3), 100, 20, measure), [
    'LongNameLo', 'ngNameLong', 'Name',
  ])
})

test('wrapping never splits an accent or a joined emoji', () => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  const graphemeMeasure = (text: string) => [...segmenter.segment(text)].length * 10
  const word = 'e\u0301👩‍🔬e\u0301👩‍🔬'
  assert.deepEqual(wrapPersonalThanks(word, 20, 20, graphemeMeasure), ['e\u0301👩‍🔬', 'e\u0301👩‍🔬'])
})

test('the writing edge completes the first line before starting the next', () => {
  assert.deepEqual(personalThanksLineReveals(0, [300, 100]), [0, 0])
  assert.deepEqual(personalThanksLineReveals(0.375, [300, 100]), [0.5, 0])
  assert.deepEqual(personalThanksLineReveals(0.75, [300, 100]), [1, 0])
  assert.deepEqual(personalThanksLineReveals(0.875, [300, 100]), [1, 0.5])
  assert.deepEqual(personalThanksLineReveals(1, [300, 100]), [1, 1])
})

test('writing progress is bounded and supports any number of wrapped lines', () => {
  assert.deepEqual(personalThanksLineReveals(-1, [100]), [0])
  assert.deepEqual(personalThanksLineReveals(2, [100]), [1])
  assert.deepEqual(personalThanksLineReveals(0.5, []), [])
  assert.deepEqual(personalThanksLineReveals(0.5, [100, 100, 100, 100]), [1, 1, 0, 0])
  assert.deepEqual(personalThanksLineReveals(0.5, [0]), [0])
})

test('short messages retain the preferred handwritten size', () => {
  assert.equal(fitPersonalThanksFontSize('To mom...', 330, 54, 24, measure), 24)
  assert.equal(fitPersonalThanksFontSize('', 330, 54, 24, measure), 24)
})

test('long messages are sized down inside a fixed area, not truncated', () => {
  const text = 'To someone with a longer acknowledgment, for always being there and helping me finish this dissertation...'
  const size = fitPersonalThanksFontSize(text, 330, 54, 24, measure)
  assert.ok(size > 1 && size < 24)
  assert.equal(size * 4, Math.floor(size * 4))
  assert.ok(fitPersonalThanksFontSize(text, 500, 100, 24, measure) >= size)
})

test('long unbroken names also fit without a horizontal overflow', () => {
  const size = fitPersonalThanksFontSize('LongName'.repeat(20), 330, 54, 24, measure)
  assert.ok(size > 1 && size < 24)
})
