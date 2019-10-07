import React, { useEffect, useRef, useCallback } from 'react'
import './App.css'
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)
  const frameIDRef = useRef<number | null>(null)
  const cubeRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    const canvasRoot = canvasRootRef.current as HTMLDivElement

    let width = canvasRoot.clientWidth
    let height = canvasRoot.clientHeight

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 8, 8)

    // Object
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db, opacity: 0.4, transparent: true })
    const cube = new THREE.Mesh(geometry, material)
    cubeRef.current = cube
    cube.position.set(0, 0.5, 0)

    // Object lines
    const edgeGeometry = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
    const lineSegments = new THREE.LineSegments(edgeGeometry, lineMaterial)
    cube.add(lineSegments)

    // Scene
    const scene = new THREE.Scene()
    scene.add(cube)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor('#202020')
    renderer.setSize(width, height)

    // Controls
    const mapControl = new MapControls(camera, renderer.domElement)

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

  const handleResizeCube = useCallback((prop: 'width' | 'height' | 'depth', dir: boolean) => {
    const cube = cubeRef.current
    if (cube) {
      console.log(cube)
    }
  }, [])

  return (
    <div className="App">
      <div className="canvas-root" ref={canvasRootRef}></div>
      <ul className="control">
        <li className="control-row">
          <label className="control-label">Width</label>
          <button className="control-btn" onClick={() => handleResizeCube('width', true)}>
            +
          </button>
          <button className="control-btn" onClick={() => handleResizeCube('width', false)}>
            -
          </button>
        </li>
        <li className="control-row">
          <label className="control-label">Height</label>
          <button className="control-btn" onClick={() => handleResizeCube('height', true)}>
            +
          </button>
          <button className="control-btn" onClick={() => handleResizeCube('height', false)}>
            -
          </button>
        </li>
      </ul>
    </div>
  )
}

export default App
