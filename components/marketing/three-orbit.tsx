'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeOrbit() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Scene setup ──────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // ── Objects ──────────────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    const primaryColor = new THREE.Color(0x3157d5)
    const accentColor  = new THREE.Color(0x6d5ef5)

    // Central hub
    const centralHub = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshPhongMaterial({
        color: primaryColor,
        emissive: primaryColor,
        emissiveIntensity: 0.2,
        shininess: 100,
      })
    )
    group.add(centralHub)

    // Orbiting elements
    type OrbEl = { mesh: THREE.Mesh; orbitRadius: number; angle: number; speed: number; yOffset: number }
    const elements: OrbEl[] = []
    const elementCount = 5

    for (let i = 0; i < elementCount; i++) {
      const radius = 0.2 + Math.random() * 0.2
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 24),
        new THREE.MeshPhongMaterial({
          color: i % 2 === 0 ? primaryColor : accentColor,
          transparent: true,
          opacity: 0.8,
        })
      )
      const orbitRadius = 2.5 + Math.random() * 1.5
      const angle       = (i / elementCount) * Math.PI * 2

      elements.push({ mesh, orbitRadius, angle, speed: 0.005 + Math.random() * 0.01, yOffset: (Math.random() - 0.5) * 2 })
      group.add(mesh)
    }

    // ── Lighting ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // ── Animation loop ────────────────────────────────────────────
    let animId: number
    function animate() {
      animId = requestAnimationFrame(animate)
      group.rotation.y += 0.002
      elements.forEach(el => {
        el.angle += el.speed
        el.mesh.position.x = Math.cos(el.angle) * el.orbitRadius
        el.mesh.position.z = Math.sin(el.angle) * el.orbitRadius
        el.mesh.position.y = Math.sin(el.angle * 0.5) * el.yOffset
      })
      renderer.render(scene, camera)
    }
    animate()

    // ── Resize handler ────────────────────────────────────────────
    function onResize() {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  )
}
