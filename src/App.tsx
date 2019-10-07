import React, { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)

  const frameIDRef = useRef<number | null>(null)

  useEffect(() => {
    const canvasRoot = canvasRootRef.current as HTMLDivElement

    let width = canvasRoot.clientWidth
    let height = canvasRoot.clientHeight

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 8, 8)

    // Object
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0.5, 0)

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

  return (
    <div className="App">
      <div className="canvasRoot" ref={canvasRootRef}></div>
    </div>
  )
}

export default App
