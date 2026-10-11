import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { additionalPublications } from '../data/additional-publications.ts'
import {
  publicationArrivalDelays,
  publicationBoardPoses,
  publicationBounds,
  publicationIntroPoses,
} from '../components/publication-board-layout.ts'

test('the seven distinct headers represent six articles and one separate preprint', () => {
  assert.equal(additionalPublications.length, 7)
  assert.equal(new Set(additionalPublications.map(paper => paper.id)).size, 7)
  assert.equal(new Set(additionalPublications.map(paper => paper.href)).size, 7)
  const published = additionalPublications.filter(paper => paper.status === 'journal-article')
  assert.equal(published.length, 6)
  assert.equal(published.filter(paper => paper.role !== 'Co-author').length, 2)
  assert.equal(published.filter(paper => paper.role === 'Shared first author').length, 1)
  assert.equal(published.filter(paper => paper.role === 'Co-author').length, 4)
  assert.equal(additionalPublications.filter(paper => paper.status === 'preprint').length, 1)
})

test('the opening frame retains the same three headers on the right', () => {
  const poses = publicationIntroPoses(additionalPublications, 884, 391)
  assert.deepEqual(Object.keys(poses), ['hailstorm', 'precipitation-types', 'sophy'])
  for (const pose of Object.values(poses)) {
    assert.equal(pose.angle, 0)
    assert.equal(pose.width, 536)
    assert.ok(pose.x > 280)
    assert.ok(pose.y >= 0 && pose.y + pose.height <= 391)
  }
  assert.ok(poses['precipitation-types'].y > poses.hailstorm.y + poses.hailstorm.height)
  assert.ok(poses.sophy.y > poses['precipitation-types'].y + poses['precipitation-types'].height)
})

test('the single-click arrival sequence contains all four additions and settles within two seconds', () => {
  assert.deepEqual(Object.keys(publicationArrivalDelays),
    additionalPublications.filter(paper => !paper.initial).map(paper => paper.id))
  const delays = Object.values(publicationArrivalDelays)
  assert.deepEqual(delays, [220, 480, 740, 1000])
  assert.ok(Math.max(...delays) + 720 <= 2000)
  const source = readFileSync(new URL('../sections/close.md', import.meta.url), 'utf8')
  assert.match(source, /title: Additional research contributions\nclicks: 1/)
})

test('every rotated header fits without overlapping any other header', () => {
  for (const [width, height] of [[884, 420], [884, 438], [884, 454], [960, 454]]) {
    const poses = publicationBoardPoses(additionalPublications, width, height)
    assert.equal(Object.keys(poses).length, 7)
    assert.deepEqual(poses, publicationBoardPoses(additionalPublications, width, height))
    const bounds = Object.entries(poses).map(([id, pose]) => {
      assert.ok(pose.width > 320, `${id}: header too small at ${width} × ${height}`)
      assert.ok(Math.abs(pose.angle) <= 1.4)
      const rect = publicationBounds(pose)
      assert.ok(rect.left >= 8 && rect.right <= width - 8, `${id}: horizontal clipping`)
      assert.ok(rect.top >= 12 - 1e-7 && rect.bottom <= height - 12 + 1e-7, `${id}: vertical clipping`)
      return { id, ...rect }
    })
    for (const [index, a] of bounds.entries()) {
      for (const b of bounds.slice(index + 1)) {
        const overlap = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
        assert.ok(!overlap, `${a.id} overlaps ${b.id}`)
      }
    }
  }
})

test('source dimensions and name outlines match the local, unmodified header images', () => {
  for (const paper of additionalPublications) {
    const bytes = readFileSync(new URL(`../figures/additional-publications/${paper.asset}`, import.meta.url))
    assert.equal(bytes.readUInt32BE(16), paper.width, paper.id)
    assert.equal(bytes.readUInt32BE(20), paper.height, paper.id)
    const mark = paper.highlight
    assert.ok(mark.x >= 0 && mark.y >= 0)
    assert.ok(mark.x + mark.width <= paper.width && mark.y + mark.height <= paper.height)
  }
})
