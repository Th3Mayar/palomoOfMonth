<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">Scores Page</h1>
    <p class="text-lg mb-8">This page is under construction.</p>
    <div ref="chartRef" class="chart-container" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
});

// Reference to the chart DOM element
const chartRef = ref<HTMLDivElement | null>(null);

// Chart initialization function
const initChart = (dom: HTMLDivElement) => {
  const chart = echarts.init(dom);
  const option: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };
  chart.setOption(option);
};

// Initialize the chart when the component is mounted
onMounted(() => {
  if (chartRef.value) {
    initChart(chartRef.value);
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  height: 400px;
}
</style>