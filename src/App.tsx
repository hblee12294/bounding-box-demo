import React, { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'

const App: React.FC = () => {
  const canvasRootRef = useRef<HTMLDivElement>(null)

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)

  const initScene = () => {
    const canvasRoot = canvasRootRef.current as HTMLDivElement

    const height = canvasRoot.clientHeight
    const width = canvasRoot.clientWidth

    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.Camera()
  }

  useEffect(() => {
    initScene()
  }, [])

  return (
    <div className="App">
      <div className="canvasRoot" ref={canvasRootRef}></div>
    </div>
  )
}

export default App
