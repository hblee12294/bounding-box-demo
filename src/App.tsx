import React, { useEffect, useRef, useCallback, useState } from 'react'
import './App.css'

// Three
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Wireframe } from 'three/examples/jsm/lines/Wireframe'
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2'

// Components
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const DEFAULT_SLIDER_ATTRS = {
  min: 1,
  max: 10,
  step: 0.01,
  handleStyle: {
    border: 'none',
    borderRadius: '0',
  } as React.CSSProperties,
}

interface Cube extends THREE.Mesh {
  children: [Wireframe]
}

function updateCubeGeometry(mesh: Cube, geometry: THREE.BufferGeometry) {
  // Dispose outline & mesh geometries
  mesh.geometry.dispose()
  mesh.children[0].geometry.dispose()

  mesh.geometry = geometry
  mesh.children[0].geometry = new WireframeGeometry2(geometry)
}

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)
  const frameIDRef = useRef<number | null>(null)
  const cubesRef = useRef<Cube[]>([])
  const currentCubeIndexRef = useRef<number>(0)

  const [cubeWidth, setCubeWidth] = useState<number>(1)
  const [cubeHeight, setCubeHeight] = useState<number>(1)
  const [cubeDepth, setCubeDepth] = useState<number>(1)

  useEffect(() => {
    const canvasRoot = canvasRootRef.current as HTMLDivElement

    let width = canvasRoot.clientWidth
    let height = canvasRoot.clientHeight

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 8, 8)

    // Scene
    const scene = new THREE.Scene()

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
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
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // Object
    // - Geometry
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.Float32BufferAttribute([], 3))
    const material = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      opacity: 0.4,
      transparent: true,
    })

    // - Outline
    const lineMaterial = new LineMaterial({
      color: 0xffffff,
      linewidth: 0.8,
      dashed: false,
      resolution: new THREE.Vector2(width, height),
    })

    const cube = new THREE.Mesh(geometry, material) as Cube
    const wireframe = new Wireframe(new WireframeGeometry2(geometry), lineMaterial)
    wireframe.computeLineDistances()
    wireframe.scale.set(1, 1, 1)
    cube.add(wireframe)

    cube.position.set(0, 0.5, 0)
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

    updateCubeGeometry(cubes[currentCubeIndex], new THREE.BoxBufferGeometry(cubeWidth, cubeHeight, cubeDepth))
  }, [cubeWidth, cubeHeight, cubeDepth])

  return (
    <div className="App">
      <div className="canvas-root" ref={canvasRootRef}></div>
      <ul className="control">
        <li className="control-row">
          <label className="control-label">Width</label>
          <Slider value={cubeWidth} onChange={setCubeWidth} {...DEFAULT_SLIDER_ATTRS} />
        </li>
        <li className="control-row">
          <label className="control-label">Height</label>
          <Slider value={cubeHeight} onChange={setCubeHeight} {...DEFAULT_SLIDER_ATTRS} />
        </li>
        <li className="control-row">
          <label className="control-label">Depth</label>
          <Slider value={cubeDepth} onChange={setCubeDepth} {...DEFAULT_SLIDER_ATTRS} />
        </li>
      </ul>
    </div>
  )
}

export default App
