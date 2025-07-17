<template>
  <div :class="['shadcn-skeleton', customClass]" />
</template>

<script setup lang="ts">
const props = defineProps({
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.shadcn-skeleton {
  display: block;
  background-color: hsl(var(--muted));
  border-radius: calc(var(--radius) - 2px);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.shadcn-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shadcn-skeleton-loading 1.2s infinite;
}
@keyframes shadcn-skeleton-loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
