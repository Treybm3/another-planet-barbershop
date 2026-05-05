'use client'

import { useEffect, useRef } from 'react'

export default function VoidParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width  = canvas.parentElement?.offsetWidth  ?? window.innerWidth
    let height = canvas.parentElement?.offsetHeight ?? 400
    canvas.width  = width
    canvas.height = height

    const particles = Array.from({ length: 80 }, () => ({
      x:      Math.random() * width,
      y:      Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      base:   Math.random() * 0.3 + 0.12,
      vx:     (Math.random() - 0.5) * 0.22,
      vy:     (Math.random() - 0.5) * 0.22,
      phase:  Math.random() * Math.PI * 2,
    }))

    let frame: number

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      const t = Date.now() * 0.0008

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const opacity = p.base * (0.6 + 0.4 * Math.sin(t + p.phase))
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(245,158,11,${opacity})`
        ctx!.fill()
      }

      frame = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      width  = canvas.parentElement?.offsetWidth  ?? window.innerWidth
      height = canvas.parentElement?.offsetHeight ?? 400
      canvas.width  = width
      canvas.height = height
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  )
}
