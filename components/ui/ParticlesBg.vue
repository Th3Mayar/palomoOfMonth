<template>
  <div ref="particlesRef" class="particles-bg"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { tsParticles, type ISourceOptions, type Engine } from 'tsparticles-engine'
import { loadSlim } from 'tsparticles-slim'

const particlesRef = ref<HTMLElement | null>(null)
let particlesId: string | null = null

onMounted(async () => {
  await loadSlim(tsParticles as Engine)
  particlesId = 'particles-bg-id'
  if (particlesRef.value) {
    tsParticles.load(particlesId, {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      particles: {
        number: { value: 100 },
        color: { value: '#fff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: { enable: true, speed: 1, direction: 'none', random: false, straight: false, outModes: { default: 'out' } }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' }
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { quantity: 4 }
        }
      },
      detectRetina: true
    } as ISourceOptions)
  }

  const contentWithId = document.querySelector(`#${particlesId}`)

  if (contentWithId) {
    contentWithId.classList.add('h-full', 'absolute', 'top-0', 'z-0', 'pointer-events-none', 'overflow-hidden')
  }

})

onBeforeUnmount(() => {
  if (particlesId) {
    tsParticles.dom().forEach((container) => {
      if (container.id === particlesId) container.destroy()
    })
  }
})
</script>

<style scoped>
.particles-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
