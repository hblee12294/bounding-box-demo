import React, { useEffect, useRef, useState } from 'react'
import './App.css'

// Three
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  GridHelper,
  AxesHelper,
  MeshBasicMaterial,
  BoxBufferGeometry,
  Float32BufferAttribute,
  Vector2,
  BufferGeometry,
} from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

import { FatWireframeCube, FatEdgesCube, Cube } from './types'
import { updateFatWireframeCube, updateFatEdgesCube, createCube } from './functions'

// Components
import { Slider } from './components'

const commonSliderProps = {
  min: 1,
  max: 10,
  step: 0.1,
}

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)
  const frameIDRef = useRef<number | null>(null)
  const cubesRef = useRef<(Cube)[]>([])
  const currentCubeIndexRef = useRef<number>(0)

  const [cubeWidth, setCubeWidth] = useState<number>(1)
  const [cubeHeight, setCubeHeight] = useState<number>(1)
  const [cubeDepth, setCubeDepth] = useState<number>(1)

  useEffect(() => {
    const canvasRoot = canvasRootRef.current as HTMLDivElement

    let width = canvasRoot.clientWidth
    let height = canvasRoot.clientHeight

    // Camera
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 8, 8)

    // Scenefds
    const scene = new Scene()

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setClearColor('#202020')
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // Controls
    const mapControl = new MapControls(camera, renderer.domElement)
    const dragControl = new DragControls(cubesRef.current, camera, renderer.domElement)

    dragControl.addEventListener('dragstart', function(event) {
      const e = event as DragEvent

      // Disbale mapControl
      mapControl.enabled = false
    })

    dragControl.addEventListener('dragend', function(event) {
      const e = event as DragEvent

      // Enable mapControl
      mapControl.enabled = true
    })

    // Helpers
    const gridHelper = new GridHelper(10, 10)
    scene.add(gridHelper)
    const axesHelper = new AxesHelper(5)
    scene.add(axesHelper)

    // Cube
    const geometry = new BufferGeometry()
    geometry.addAttribute('position', new Float32BufferAttribute([], 3))

    const material = new MeshBasicMaterial({
      color: 0x1abc9c,
      opacity: 0.4,
      transparent: true,
    })

    // Wireframe / edges material
    const lineMaterial = new LineMaterial({
      color: 0xffffff,
      linewidth: 1,
      dashed: false,
      resolution: new Vector2(width, height),
    })

    const cube = createCube('FatEdgesCube', geometry, material, lineMaterial)
    // const cube = createCube('FatWireframeCube', geometry, material, lineMaterial)
    cubesRef.current.push(cube)
    scene.add(cube)

    // Functions
    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = canvasRoot.clientWidth
      height = canvasRoot.clientHeight

      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderScene()
    }

    const animate = () => {
      renderScene()
      frameIDRef.current = requestAnimationFrame(animate)
    }

    canvasRoot.append(renderer.domElement)
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameIDRef.current as number)
    }
  }, [])

  useEffect(() => {
    const cubes = cubesRef.current
    const currentCubeIndex = currentCubeIndexRef.current
    const name = cubes[currentCubeIndex].name

    switch (name) {
      case 'FatWireframeCube':
        updateFatWireframeCube(
          cubes[currentCubeIndex] as FatWireframeCube,
          new BoxBufferGeometry(cubeWidth, cubeHeight, cubeDepth),
        )
        break
      case 'FatEdgesCube':
        updateFatEdgesCube(
          cubes[currentCubeIndex] as FatEdgesCube,
          new BoxBufferGeometry(cubeWidth, cubeHeight, cubeDepth),
        )
        break
    }
  }, [cubeWidth, cubeHeight, cubeDepth])

  return (
    <div className="App">
      <div className="canvas-root" ref={canvasRootRef}></div>
      <ul className="control">
        <li className="control-row">
          <label className="control-label">Width</label>
          <Slider value={cubeWidth} onChange={setCubeWidth} {...commonSliderProps} />
        </li>
        <li className="control-row">
          <label className="control-label">Height</label>
          <Slider value={cubeHeight} onChange={setCubeHeight} {...commonSliderProps} />
        </li>
        <li className="control-row">
          <label className="control-label">Depth</label>
          <Slider value={cubeDepth} onChange={setCubeDepth} {...commonSliderProps} />
        </li>
      </ul>
    </div>
  )
}

export default App
