<template>
  <div class="relative inline-block">
    <div 
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
    >
      <slot />
    </div>
    
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTooltip && content"
        :class="tooltipClasses"
        role="tooltip"
      >
        {{ content }}
        <div :class="arrowClasses"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  size: 'md'
})

const showTooltip = ref(false)

const tooltipClasses = computed(() => {
  const baseClasses = 'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 pointer-events-none max-w-xs break-words'
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  }
  
  return `${baseClasses} ${positionClasses[props.position]} ${sizeClasses[props.size]}`
})

const arrowClasses = computed(() => {
  const baseClasses = 'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45'
  
  const positionClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
    left: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
    right: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2'
  }
  
  return `${baseClasses} ${positionClasses[props.position]}`
})
</script>
