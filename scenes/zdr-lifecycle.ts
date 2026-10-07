import { Scene, UpdateFromAlphaFunc, VGroup, VMobject } from 'manim-web'
import { zdrLifecycleFrame } from './zdr-interpretation'

const WIDTH = 1000
const HEIGHT = 650
const FRAME_W = 10
const FRAME_H = 6.5

export const zdrLifecyclePreview = zdrLifecycleFrame(0).map(shape => ({
  d: `M${shape.points.map(([x, y]) => `${((x / FRAME_W + .5) * WIDTH).toFixed(2)},${((.5 - y / FRAME_H) * HEIGHT).toFixed(2)}`).join(' L')}`,
  color: shape.color,
  fill: shape.fill,
  stroke: shape.width ? shape.opacity : 0,
  width: shape.width,
}))

export async function zdrLifecycleInterpretation() {
  const scene = new Scene(document.getElementById('container'), {
    width: WIDTH, height: HEIGHT, frameWidth: FRAME_W, frameHeight: FRAME_H, backgroundColor: '#101b2b',
  })
  const objects = zdrLifecycleFrame(0).map(shape => new VMobject().setPointsAsCorners(shape.points).setColor(shape.color)
    .setFillOpacity(shape.fill).setStrokeOpacity(shape.opacity).setStrokeWidth(shape.width))
  const illustration = new VGroup(...objects)
  // Register before either awaited play; CuManim owns rewind and disposal.
  scene.add(illustration)

  function draw(step: number, alpha: number) {
    zdrLifecycleFrame(step, alpha).forEach((shape, index) => objects[index].setPointsAsCorners(shape.points)
      .setFillOpacity(shape.fill).setStrokeOpacity(shape.opacity))
  }

  // One click for aggregation; one for preferential fallout. No sign tutorial.
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(1, alpha), { duration: 2.2 }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(2, alpha), { duration: 2.2 }))
}
