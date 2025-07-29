<template>
  <div class="w-full max-w-md mx-auto rounded-3xl shadow-xl p-6 flex flex-col items-center space-y-6 !z-50">
    <Button as="button" variant="secondary" @click.prevent="navigateTo('/')" class="text-end justify-end select-none" v-show="!showOnlySeconds">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Home
    </Button>
    <h2 v-show="!showOnlySeconds" class="text-2xl font-semibold text-background text-center select-none">
      The winner comes out in
    </h2>
    <div v-if="showOnlySeconds && !isFinished" class="flex justify-center w-full select-none">
      <span class="big-seconds animate-pop !text-contentButton !text-[15em]">{{ countdown.seconds }}</span>
    </div>
    <div v-else class="flex justify-center gap-4 w-full select-none">
      <TimeBlock label="Days" :value="countdown.days" />
      <TimeBlock label="Hours" :value="countdown.hours" />
      <TimeBlock label="Minutes" :value="countdown.minutes" />
      <TimeBlock label="Seconds" :value="countdown.seconds" />
    </div>
   <section v-show="!showOnlySeconds" class="w-full flex items-center justify-center">
     <Button as="button" variant="link" @click.prevent="navigateTo('/winners/game')"
      class="text-end justify-end select-none">
      <Gamepad2 class="mr-2 h-4 w-4" />
      Snake game
    </Button>
    <Button as="button" variant="link" @click.prevent="navigateTo('/winners/game/memory')"
      class="text-end justify-end select-none">
      <Gamepad2 class="mr-2 h-4 w-4" />
      Memory / Pairs
    </Button>
   </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const showOnlySeconds = computed(() => 
  countdown.value.days === 0 && countdown.value.hours === 0 && countdown.value.minutes === 0
)
const isFinished = computed(() =>
  countdown.value.days === 0 &&
  countdown.value.hours === 0 &&
  countdown.value.minutes === 0 &&
  countdown.value.seconds === 0
)

import TimeBlock from './TimeBlock.vue'
import { ArrowLeft, Gamepad2 } from 'lucide-vue-next'
import Button from './Button.vue'

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

// Function to get the last business day of the current month at 14:30
function getTargetDate() {
  const now = new Date();
  // Define the last day of the month
  let lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // If the last day is a weekend, move to the previous Friday
  while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
    lastDay.setDate(lastDay.getDate() - 1);
  }
  // Set the time to 14:30
  lastDay.setHours(14, 30, 0, 0);

  // LOGIC TO REMOVE FOR THE FUTURE.
  if (now.getDate() === 29) {
    now.setHours(17, 0, 0, 0);
    return now;
  }

  return lastDay;
}

const updateCountdown = () => {
  const now = new Date();
  const targetDate = getTargetDate();
  const diff = targetDate.getTime() - now.getTime();

  countdown.value = {
    days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
  };
}

let interval: any

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.big-seconds {
  font-size: 6rem;
  font-weight: bold;
  color: var(--content-button);
  text-shadow: 0 0 20px #fff, 0 0 40px var(--state-variant);
  min-width: 7rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

@keyframes pop {
  0% { transform: scale(1); }
  10% { transform: scale(1.3); }
  20% { transform: scale(1); }
}

.animate-pop {
  animation: pop 1s infinite;
}
</style>