import { Vector3, Line, BufferGeometry, BufferAttribute } from 'three'

export const isEmptyVector3 = (point: Vector3) => {
  return !point.x && !point.y && !point.z
}

export const updateDrawLine = (line: Line, index: number, point: Vector3): void => {
  const geometry = line.geometry as BufferGeometry
  const position = geometry.attributes.position as BufferAttribute

  position.setXYZ(index, point.x, point.y, point.z)

  position.needsUpdate = true
  geometry.setDrawRange(0, index + 1)
}
