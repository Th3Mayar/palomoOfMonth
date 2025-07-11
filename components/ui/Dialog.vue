<template>
  <DialogRoot v-model:open="dialogOpen" @update:open="onOpenChange">
    <slot />
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogRoot } from 'radix-vue'

interface Props {
  open?: boolean
}

interface Emits {
  (e: 'update:open', open: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<Emits>()

const dialogOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const onOpenChange = (open: boolean) => {
  emit('update:open', open)
}
</script>
