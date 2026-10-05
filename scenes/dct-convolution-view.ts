export type DctPoint = [number, number, number]

// Rotate into the camera's coordinate frame before dropping the depth axis.
// Both rotations are rigid: yaw also contributes to the projected vertical
// coordinate after elevation, so constant-value baselines can actually tilt.
export function rotateDctPoint(point: DctPoint, pivot: DctPoint, yaw: number, elevation: number): DctPoint {
  const x = point[0] - pivot[0]
  const y = point[1] - pivot[1]
  const z = point[2] - pivot[2]
  const horizontal = x * Math.cos(yaw) + z * Math.sin(yaw)
  const depth = z * Math.cos(yaw) - x * Math.sin(yaw)
  return [pivot[0] + horizontal,
    pivot[1] + y * Math.cos(elevation) + depth * Math.sin(elevation),
    pivot[2] - y * Math.sin(elevation) + depth * Math.cos(elevation)]
}
