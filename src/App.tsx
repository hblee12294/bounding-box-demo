import React, { useEffect, useRef, useCallback, useState } from 'react'
import './App.css'

// Three
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'

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

interface Group extends THREE.Group {
  children: [THREE.LineSegments, THREE.Mesh]
}

function updateCubeGeometry(mesh: Group, geometry: THREE.BufferGeometry) {
  // Dispose outline & mesh geometries
  mesh.children[0].geometry.dispose()
  mesh.children[1].geometry.dispose()

  mesh.children[0].geometry = new THREE.EdgesGeometry(geometry)
  mesh.children[1].geometry = geometry
}

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)
  const frameIDRef = useRef<number | null>(null)
  const cubeRef = useRef<Group | null>(null)

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

    // Object
    // - Group
    const group = new THREE.Group() as Group

    // - Geometry
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.Float32BufferAttribute([], 3))
    const material = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      opacity: 0.4,
      transparent: true,
    })

    // - Outline
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
    })

    group.add(new THREE.LineSegments(geometry, lineMaterial))
    group.add(new THREE.Mesh(geometry, material))

    group.position.set(0, 0.5, 0)
    cubeRef.current = group

    // Scene
    const scene = new THREE.Scene()
    scene.add(group)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor('#202020')
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // Controls
    new MapControls(camera, renderer.domElement)

    // Helpers
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

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
    const cube = cubeRef.current

    if (cube) {
      updateCubeGeometry(cube, new THREE.BoxBufferGeometry(cubeWidth, cubeHeight, cubeDepth))
    }
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
