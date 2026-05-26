import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

interface HeroSceneProps {
  reducedMotion: boolean
  onReady?: () => void
  onContextLost?: () => void
  onContextRestored?: () => void
}

function InterfaceConstellation({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const layers = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const depth = index * 0.22
        const width = THREE.MathUtils.randFloat(0.8, 1.8)
        const height = THREE.MathUtils.randFloat(0.22, 0.5)

        return {
          key: `layer-${index}`,
          width,
          height,
          position: [THREE.MathUtils.randFloatSpread(3), THREE.MathUtils.randFloatSpread(2), -depth] as [number, number, number],
          rotation: [THREE.MathUtils.randFloat(-0.2, 0.2), THREE.MathUtils.randFloat(-0.35, 0.35), THREE.MathUtils.randFloat(-0.3, 0.3)] as [number, number, number],
          opacity: THREE.MathUtils.randFloat(0.18, 0.5),
        }
      }),
    [],
  )

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const pointerX = state.pointer.x * 0.35
    const pointerY = state.pointer.y * 0.2

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointerX, reducedMotion ? 10 : 4, state.clock.getDelta())
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -pointerY, reducedMotion ? 10 : 4, state.clock.getDelta())

    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {layers.map((layer, index) => (
        <Float
          key={layer.key}
          speed={0.8 + (index % 5) * 0.18}
          floatIntensity={reducedMotion ? 0 : 0.45}
          rotationIntensity={reducedMotion ? 0 : 0.55}
        >
          <mesh position={layer.position} rotation={layer.rotation}>
            <planeGeometry args={[layer.width, layer.height]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#6db9ff' : '#dcefff'}
              roughness={0.28}
              metalness={0.48}
              transparent
              opacity={layer.opacity}
            />
          </mesh>
        </Float>
      ))}

      {!reducedMotion && <Sparkles count={24} size={2.2} speed={0.4} color="#7fc1ff" scale={[5, 2.8, 3]} />}
    </group>
  )
}

export default function HeroScene({
  reducedMotion,
  onReady,
  onContextLost,
  onContextRestored,
}: HeroSceneProps) {
  const cleanupContextListenersRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      cleanupContextListenersRef.current?.()
      cleanupContextListenersRef.current = null
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 42 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.6 }}
      onCreated={(state) => {
        cleanupContextListenersRef.current?.()
        cleanupContextListenersRef.current = null

        const canvas = state.gl.domElement
        canvas.setAttribute('data-r3f-canvas', 'true')
        if (import.meta.env.DEV) {
          console.log('[HeroScene] Canvas created', canvas)
        }

        const handleContextLost = (event: Event) => {
          event.preventDefault()
          console.warn('Hero WebGL context lost')
          onContextLost?.()
        }

        const handleContextRestored = () => {
          console.info('Hero WebGL context restored')
          onContextRestored?.()
          onReady?.()
        }

        canvas.addEventListener('webglcontextlost', handleContextLost, false)
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false)

        cleanupContextListenersRef.current = () => {
          canvas.removeEventListener('webglcontextlost', handleContextLost, false)
          canvas.removeEventListener('webglcontextrestored', handleContextRestored, false)
        }

        onReady?.()
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 4]} intensity={1.6} color="#7fb8ff" />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#9ab9dd" />
      <InterfaceConstellation reducedMotion={reducedMotion} />
    </Canvas>
  )
}
