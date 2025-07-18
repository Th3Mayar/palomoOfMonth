<template>
  <div class="relative w-full max-w-[400px] mx-auto aspect-[4/5] h-full justify-center items-center translate-y-[40%]">
    <img
      src="/images/template/template_winner.svg"
      class="absolute inset-0 w-full h-full pointer-events-none select-none"
      alt="Winner Frame"
      draggable="false"
    />

    <img
      v-if="image"
      :src="processedImage || image"
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
import { removeBackground } from '~/lib/utils';
import { ref, watch } from 'vue';

const props = defineProps<{
  image: string
  name: string
}>()

const processedImage = ref<string>('');

function isValidUrl(url: string) {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

watch(
  () => props.image,
  async (newImage) => {
    if (newImage && isValidUrl(newImage)) {
      try {
        processedImage.value = await removeBackground(newImage)
      } catch (e) {
        processedImage.value = ''
        console.error('Error al remover el fondo:', e)
      }
    } else {
      processedImage.value = ''
      if (newImage) {
        console.error('La imagen debe ser una URL pública válida para remove.bg')
      }
    }
  },
  { immediate: true }
)

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
  textShadow: '0 1px 5px #0cfb04',
  "font-family": 'Montserrat',
}
</script>