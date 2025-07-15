<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    @click.self="close"
  >
    <div class="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border-t-4 border-primary">
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-foreground">{{ title }}</h3>
        <Button @click="close" variant="ghost" size="sm" class="h-8 w-8 p-0">
          <X class="h-4 w-4" />
        </Button>
      </div>
      <div class="p-6 space-y-4">
        <ul v-if="scores.length">
          <li
            v-for="(score, i) in scores"
            :key="i"
            class="border-b pb-2 mb-2"
          >
            <p class="text-sm text-muted-foreground mb-1">{{ formatDate(score.date) }}</p>
            <p class="text-foreground text-sm">{{ score.reason }}</p>
          </li>
        </ul>
        <div v-else class="text-muted-foreground text-sm">No records found.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  scores: { reason: string, date: string }[]
  title: string
}>()

const emit = defineEmits(['close'])
const close = () => emit('close')

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>