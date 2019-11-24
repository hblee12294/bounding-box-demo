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
  Vector3,
  BufferGeometry,
  Plane,
  Line,
  LineBasicMaterial,
  Raycaster,
} from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

import { Cube, CubeType } from './types'
import { createCube, updateCube, isEmptyVector3, updateDrawLine } from './functions'

import { CubeControls } from './libs'

// Components
import { Slider } from './components'

const GROUND_DISTANCE = 0.5

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

    // Helpers
    const gridHelper = new GridHelper(10, 10)
    scene.add(gridHelper)
    const axesHelper = new AxesHelper(5)
    scene.add(axesHelper)

    // Init drawline
    const ground = new Plane(new Vector3(0, 1, 0), 0)
    const startPoint = new Vector3()
    const endPoint = new Vector3()

    const drawLineGeometry = new BufferGeometry()
    drawLineGeometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(3 * 3), 3))

    const drawLineMaterial = new LineBasicMaterial({ color: 0xffff00, linewidth: 2 })
    drawLineMaterial.needsUpdate = false
    const drawLine = new Line(drawLineGeometry, drawLineMaterial)
    scene.add(drawLine)

    // Cube
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute([], 3))

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

    const cube = createCube(CubeType.FatEdgesCube, geometry, material, lineMaterial)
    cube.position.setY(GROUND_DISTANCE)
    cubesRef.current.push(cube)
    scene.add(cube)

    // Controls
    const mapControl = new MapControls(camera, renderer.domElement)
    const cubeControl = new CubeControls(cubesRef.current, camera, renderer.domElement)

    cubeControl.addEventListener('mousedown', function(event) {
      const raycaster = event.raycaster as Raycaster

      if (isEmptyVector3(startPoint)) {
        raycaster.ray.intersectPlane(ground, startPoint)

        updateDrawLine(drawLine, 0, startPoint)
      } else {
        raycaster.ray.intersectPlane(ground, endPoint)

        updateDrawLine(drawLine, 1, endPoint)

        startPoint.set(0, 0, 0)
        endPoint.set(0, 0, 0)
      }
    })

    cubeControl.addEventListener('mousemove', function(event) {
      const raycaster = event.raycaster as Raycaster

      if (!isEmptyVector3(startPoint)) {
        raycaster.ray.intersectPlane(ground, endPoint)
      }
    })

    cubeControl.addEventListener('mouseup', function(event) {
      // console.log(event)
    })

    cubeControl.addEventListener('dragstart', function(event) {
      const e = event as DragEvent

      // Disbale mapControl
      mapControl.enabled = false
    })

    cubeControl.addEventListener('dragend', function(event) {
      const e = event as DragEvent

      // Enable mapControl
      mapControl.enabled = true
    })

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

    updateCube(cubes[currentCubeIndex], new BoxBufferGeometry(cubeWidth, cubeHeight, cubeDepth))
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
