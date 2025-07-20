<template>
  <div class="relative w-full max-w-[400px] mx-auto aspect-[4/5] h-full justify-center items-center translate-y-[40%]">
    <svg class="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none select-none z-20 rounded-[3.5rem]" viewBox="0 0 432 532" fill="none">
      <rect
        x="8" y="8" width="416" height="516" rx="44"
        stroke="url(#snake-gradient)"
        stroke-width="12"
        stroke-linecap="round"
        stroke-dasharray="120 380 120 380"
        stroke-dashoffset="0"
        filter="url(#neon-glow)"
      >
        <animate attributeName="stroke-dashoffset" values="0;1040" dur="2s" repeatCount="indefinite" />
      </rect>
      <defs>
        <linearGradient id="snake-gradient" x1="0" y1="0" x2="432" y2="532" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10FB06" />
          <stop offset="0.5" stop-color="#1B71D9" />
          <stop offset="1" stop-color="#10FB06" />
        </linearGradient>
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#10FB06"/>
          <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#1B71D9"/>
        </filter>
      </defs>
    </svg>
    <img
      src="/images/template/template_winner.svg"
      class="absolute inset-0 w-full h-full pointer-events-none select-none rounded-3xl z-0"
      alt="Winner Frame"
      draggable="false"
    />

    <img
      v-if="image"
      :src="image"
      alt="Winner"
      class="absolute rounded-full object-cover ring-[.59rem] ring-white border-white select-none"
      :style="photoStyle"
      draggable="false"
    />

    <div
      v-if="name"
      class="absolute w-full text-center font-bold text-gray-800 select-none"
      :style="nameStyle"
    >
      {{ name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: string
  name: string
}>()

const photoStyle = {
  top: '19%',
  left: '51%',
  width: '48%',
  height: '36%',
  transform: 'translate(-50%, 0)',
}
const nameStyle = {
  top: '74%',
  left: 0,
  fontSize: '1.2rem',
  letterSpacing: '1px',
  textShadow: '0 1px 1px #0cfb04',
  "font-family": '"Press Start 2P", cursive',
}
</script>

<style scoped>
</style>