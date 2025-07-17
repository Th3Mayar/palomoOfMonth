<template>
  <h1 class="text-2xl font-bold mb-6 mt-20 text-center">Dashboard</h1>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})
</script>

<style scoped></style>