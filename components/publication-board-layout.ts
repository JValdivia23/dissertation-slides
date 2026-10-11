import type { PublicationHeader } from '../data/additional-publications'

export interface PublicationPose {
  x: number
  y: number
  width: number
  height: number
  angle: number
}

export const publicationArrivalDelays: Record<string, number> = {
  'diurnal-cycle': 220,
  'surface-energy': 480,
  'extreme-rainfall': 740,
  'parsivel-preprint': 1000,
}

const columns = [
  ['diurnal-cycle', 'sophy', 'extreme-rainfall'],
  ['hailstorm', 'precipitation-types', 'surface-energy', 'parsivel-preprint'],
]
const angles: Record<string, number> = {
  'hailstorm': -1.2,
  'precipitation-types': 1.0,
  'sophy': -1.4,
  'diurnal-cycle': 0.8,
  'surface-energy': -0.7,
  'extreme-rainfall': 1.2,
  'parsivel-preprint': -1.1,
}
const offsets: Record<string, number> = {
  'hailstorm': -4,
  'precipitation-types': 5,
  'sophy': -7,
  'diurnal-cycle': 4,
  'surface-energy': -5,
  'extreme-rainfall': 1,
  'parsivel-preprint': 3,
}

function cardHeight(paper: PublicationHeader, width: number, chrome = 17.6) {
  // Caption + 2 px gap + the screenshot frame's two 1 px borders. Keeping
  // the source aspect ratio also makes the layout independent of viewport zoom.
  return (width - 2) * paper.height / paper.width + chrome
}

export function publicationBounds(pose: PublicationPose) {
  const radians = Math.abs(pose.angle) * Math.PI / 180
  const width = pose.width * Math.cos(radians) + pose.height * Math.sin(radians)
  const height = pose.height * Math.cos(radians) + pose.width * Math.sin(radians)
  const left = pose.x + (pose.width - width) / 2
  const top = pose.y + (pose.height - height) / 2
  return { left, top, right: left + width, bottom: top + height, width, height }
}

export function publicationIntroPoses(papers: PublicationHeader[], width: number, height: number) {
  const initial = papers.filter(paper => paper.initial)
  const gap = 8.8
  const x = (width - 26.4) * 0.45 / 1.45 + 26.4
  const cardWidth = Math.min(536, width - x)
  const heights = initial.map(paper => cardHeight(paper, cardWidth, 18.96))
  let y = (height - heights.reduce((sum, h) => sum + h, 0) - gap * (initial.length - 1)) / 2
  return Object.fromEntries(initial.map((paper, index) => {
    const pose: PublicationPose = { x, y, width: cardWidth, height: heights[index], angle: 0 }
    y += heights[index] + gap
    return [paper.id, pose]
  })) as Record<string, PublicationPose>
}

export function publicationBoardPoses(papers: PublicationHeader[], width: number, height: number) {
  const margin = 12
  const gap = 10
  const laneGap = 30
  const laneWidth = (width - margin * 2 - laneGap) / 2
  const byId = new Map(papers.map(paper => [paper.id, paper]))
  const poses: Record<string, PublicationPose> = {}

  for (const [column, ids] of columns.entries()) {
    const lane = ids.map(id => {
      const paper = byId.get(id)
      if (!paper) throw new Error(`Missing publication header: ${id}`)
      return paper
    })
    const dimensions = (paper: PublicationHeader, cardWidth: number): PublicationPose => ({
      x: 0, y: 0, width: cardWidth, height: cardHeight(paper, cardWidth), angle: angles[paper.id],
    })
    const laneHeight = (cardWidth: number) => lane.reduce((sum, paper) =>
      sum + publicationBounds(dimensions(paper, cardWidth)).height, gap * (lane.length - 1))

    // Maximize legibility without overlapping even the rotated outer corners.
    // The long Springer titles get a three-document lane; four shorter headers
    // share the other lane. Neither lane has to use the other's smaller width.
    let low = 2
    let high = laneWidth - 20
    for (let iteration = 0; iteration < 32; iteration++) {
      const mid = (low + high) / 2
      if (laneHeight(mid) <= height - margin * 2) low = mid
      else high = mid
    }
    const cardWidth = low
    let top = (height - laneHeight(cardWidth)) / 2
    const left = margin + column * (laneWidth + laneGap)
    for (const paper of lane) {
      const pose = dimensions(paper, cardWidth)
      const bounds = publicationBounds(pose)
      pose.x = left + (laneWidth - pose.width) / 2 + offsets[paper.id]
      pose.y = top + (bounds.height - pose.height) / 2
      poses[paper.id] = pose
      top += bounds.height + gap
    }
  }
  return poses
}
