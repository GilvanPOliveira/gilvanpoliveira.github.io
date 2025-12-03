<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const COLORS = [
  '#020617', // slate-950
  '#020617', // slate-950 (repete pra ficar mais tempo escuro)
  '#0f172a', // slate-900
  '#111827', // slate-900 ~ slate-800
  '#22c55e', // emerald-500 (acento principal)
  '#16a34a', // emerald-600 (variação do acento)
] as const

type Color = (typeof COLORS)[number]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  maxLife: number
  color: Color
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  life: number
  maxLife: number
  color: Color
}

const getColor = (index: number): Color => {
  const safeIndex = ((index % COLORS.length) + COLORS.length) % COLORS.length
  return COLORS[safeIndex] as Color
}

let animationFrameId = 0
let idleTimer: number | undefined
let resize: (() => void) | undefined
let handlePointer: ((evt: MouseEvent | TouchEvent) => void) | undefined

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return
  }

  let width = 0
  let height = 0

  let colorIndex = 0
  let bgColor: Color = getColor(0)

  const particles: Particle[] = []
  const ripples: Ripple[] = []

  let lastTime = performance.now()

  resize = () => {
    const dpr = window.devicePixelRatio || 1
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const nextColor = (): Color => {
    colorIndex = (colorIndex + 1) % COLORS.length
    return getColor(colorIndex)
  }

  const currentColor = (): Color => getColor(colorIndex)

  const spawnBurst = (x: number, y: number) => {
    const fromColor: Color = currentColor()
    const toColor: Color = nextColor()
    bgColor = toColor

    const particleCount = 32
    for (let i = 0; i < particleCount; i += 1) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 60 + Math.random() * 80

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 8 + Math.random() * 10,
        life: 0,
        maxLife: 900 + Math.random() * 400,
        color: fromColor,
      })
    }

    const maxRadius = Math.hypot(
      Math.max(x, width - x),
      Math.max(y, height - y),
    )

    ripples.push({
      x,
      y,
      radius: 0,
      maxRadius,
      life: 0,
      maxLife: 900,
      color: fromColor,
    })
  }

  handlePointer = (evt: MouseEvent | TouchEvent) => {
    let clientX: number | null = null
    let clientY: number | null = null

    if (evt instanceof MouseEvent) {
      clientX = evt.clientX
      clientY = evt.clientY
    } else if (evt.touches[0]) {
      clientX = evt.touches[0].clientX
      clientY = evt.touches[0].clientY
    }

    if (clientX === null || clientY === null) return
    spawnBurst(clientX, clientY)
  }

  const loop = (time: number) => {
    const delta = time - lastTime
    lastTime = time

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      const r = ripples[i]
      if (!r) continue

      r.life += delta
      const t = Math.min(r.life / r.maxLife, 1)
      r.radius = r.maxRadius * t
      const alpha = 1 - t

      if (alpha <= 0) {
        ripples.splice(i, 1)
        continue
      }

      ctx.save()
      ctx.globalAlpha = alpha * 0.35
      ctx.beginPath()
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx.strokeStyle = r.color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i]
      if (!p) continue

      p.life += delta
      const t = Math.min(p.life / p.maxLife, 1)

      p.x += (p.vx * delta) / 1000
      p.y += (p.vy * delta) / 1000

      const radius = p.radius * (1 - t)
      const alpha = 1 - t

      if (alpha <= 0 || radius <= 0) {
        particles.splice(i, 1)
        continue
      }

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      ctx.restore()
    }

    animationFrameId = window.requestAnimationFrame(loop)
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousedown', handlePointer)
  window.addEventListener('touchstart', handlePointer, { passive: true })

  idleTimer = window.setTimeout(() => {
    spawnBurst(width / 2, height / 2)
  }, 1200)

  animationFrameId = window.requestAnimationFrame((t) => {
    lastTime = t
    loop(t)
  })
})

onBeforeUnmount(() => {
  if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
  if (idleTimer) window.clearTimeout(idleTimer)
  if (resize) window.removeEventListener('resize', resize)
  if (handlePointer) {
    window.removeEventListener('mousedown', handlePointer)
    window.removeEventListener('touchstart', handlePointer)
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 -z-10 block h-full w-full" />
</template>
