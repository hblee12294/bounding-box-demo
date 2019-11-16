import { Mesh } from 'three'
import { Wireframe } from 'three/examples/jsm/lines/Wireframe'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2'

export interface FatWireframeCube extends Mesh {
  children: [Wireframe]
}

export interface FatEdgesCube extends Mesh {
  children: [LineSegments2]
}

export type CubeName = 'FatWireframeCube' | 'FatEdgesCube'

export type Cube = FatWireframeCube | FatEdgesCube
