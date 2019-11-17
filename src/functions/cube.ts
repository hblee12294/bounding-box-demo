import { BufferGeometry, EdgesGeometry, Mesh, Material } from 'three'
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2'
import { Wireframe } from 'three/examples/jsm/lines/Wireframe'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

import { FatWireframeCube, FatEdgesCube, CubeType } from '../types'

export const updateFatWireframeCube = (mesh: FatWireframeCube, geometry: BufferGeometry) => {
  // Dispose outline & mesh geometries
  mesh.geometry.dispose()
  mesh.children[0].geometry.dispose()
  mesh.geometry = geometry
  mesh.children[0].geometry = new WireframeGeometry2(geometry)
}

export const updateFatEdgesCube = (mesh: FatEdgesCube, geometry: BufferGeometry) => {
  // Dispose outline & mesh geometries
  mesh.geometry.dispose()
  mesh.children[0].geometry.dispose()

  mesh.geometry = geometry
  mesh.children[0].geometry = new LineSegmentsGeometry().setPositions(new EdgesGeometry(geometry).attributes.position
    .array as Float32Array)
}

export const addFatWireframe = (mesh: Mesh, geometry: BufferGeometry, material: LineMaterial) => {
  const wireframe = new Wireframe(new WireframeGeometry2(geometry), material)

  wireframe.computeLineDistances()
  wireframe.scale.set(1, 1, 1)

  mesh.add(wireframe)
}

export const addFatEdges = (mesh: Mesh, geometry: BufferGeometry, material: LineMaterial) => {
  // Set LineSegmentsGeometry from EdgesGeometry
  const lineSegmentsGeometry = new LineSegmentsGeometry().setPositions(new EdgesGeometry(geometry).attributes.position
    .array as Float32Array)

  const edges = new LineSegments2(lineSegmentsGeometry, material)

  mesh.add(edges)
}

export const createCube = (
  name: CubeType,
  geometry: BufferGeometry,
  material: Material,
  lineMaterial: LineMaterial,
) => {
  const cube = new Mesh(geometry, material)
  cube.name = name

  switch (name) {
    case CubeType.FatWireframeCube:
      addFatWireframe(cube, geometry, lineMaterial)
      return cube as FatWireframeCube
    case CubeType.FatEdgesCube:
      addFatEdges(cube, geometry, lineMaterial)
      return cube as FatEdgesCube
  }
}
