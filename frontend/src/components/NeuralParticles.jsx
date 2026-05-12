import { useEffect, useRef } from 'react'

// lightweight canvas particle field (no external deps)
export default function NeuralParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const particleCount = reduceMotion ? 50 : 120

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const particles = []

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      particles.length = 0
      const area = w * h
      const target = Math.min(particleCount, Math.max(40, Math.floor(area / 18000)))
      for (let i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 2.2,
          a: 0.25 + Math.random() * 0.65,
          t: Math.random() * Math.PI * 2,
        })
      }
    }

    const draw = (time) => {
      if (!running) return
      const { innerWidth: w, innerHeight: h } = window

      ctx.clearRect(0, 0, w, h)

      // faint grid glow
      ctx.save()
      ctx.globalAlpha = 0.06
      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 1
      const step = 55
      for (let x = 0; x < w; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      ctx.restore()

      // particles + links
      const maxDist = 95
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.t += 0.01
        p.x += p.vx
        p.y += p.vy

        // soft drift back into bounds
        if (p.x < -30) p.x = w + 30
        if (p.x > w + 30) p.x = -30
        if (p.y < -30) p.y = h + 30
        if (p.y > h + 30) p.y = -30

        // glow
        ctx.beginPath()
        ctx.fillStyle = `rgba(0, 240, 255, ${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        // link to nearby
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.55
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}

