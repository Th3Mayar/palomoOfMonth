import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWinnerStore = defineStore('winner', () => {
  const showWinner = ref(true)
  const winner = ref(null)
  const targetDate = ref<Date | null>(null)

  function setShowWinner(val: boolean) {
    showWinner.value = val
  }

  function setWinner(val: any) {
    winner.value = val
  }

  function setTargetDate(date: Date | null) {
    targetDate.value = date
  }

  return {
    showWinner,
    winner,
    targetDate,
    setShowWinner,
    setWinner,
    setTargetDate,
  }
})
