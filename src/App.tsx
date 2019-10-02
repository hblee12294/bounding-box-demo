import React, { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)

  const frameIDRef = useRef<number | null>(null)

  useEffect(() => {
    const canvasRoot = canvasRootRef.current as HTMLDivElement

    let width = canvasRoot.clientWidth
    let height = canvasRoot.clientHeight

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 4

    // Object
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)

    // Scene
    const scene = new THREE.Scene()
    scene.add(cube)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor('#202020')
    renderer.setSize(width, height)

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
