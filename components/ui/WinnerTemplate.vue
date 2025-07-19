<template>
  <div class="relative w-full max-w-[400px] mx-auto aspect-[4/5] h-full justify-center items-center translate-y-[40%]">
    <img
      src="/images/template/template_winner.svg"
      class="absolute inset-0 w-full h-full pointer-events-none select-none rounded-3xl"
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