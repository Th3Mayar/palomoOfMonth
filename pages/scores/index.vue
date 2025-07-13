<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6">
    <h1 class="text-4xl font-bold mb-4 text-center">Puntuaciones por Palomo</h1>
    <p class="text-lg mb-8 text-center text-gray-600">Gráfico de puntuaciones totales por empleado</p>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-lg">Cargando datos...</span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-red-500 text-center">
      <p class="text-lg mb-4">Error al cargar los datos:</p>
      <p class="text-sm">{{ error }}</p>
      <button 
        @click="loadData" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reintentar
      </button>
    </div>
    
    <!-- Chart container -->
    <div v-else class="w-full max-w-6xl">
      <div ref="chartRef" class="chart-container w-full h-96 md:h-[500px] border rounded-lg shadow-lg"></div>
      
      <!-- Summary stats -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <h3 class="font-semibold text-blue-800">Total de Empleados</h3>
          <p class="text-2xl font-bold text-blue-600">{{ employeeStats.totalEmployees }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg text-center">
          <h3 class="font-semibold text-green-800">Puntuación Promedio</h3>
          <p class="text-2xl font-bold text-green-600">{{ employeeStats.averageScore.toFixed(1) }}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg text-center">
          <h3 class="font-semibold text-purple-800">Puntuación Total</h3>
          <p class="text-2xl font-bold text-purple-600">{{ employeeStats.totalScore }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { Employee } from '~/types/employee';
import type { Score } from '~/types/score';

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
});

// Composables
const { fetchEmployees, employees } = useEmployees();
const { fetchScores, scores } = useScores();

// Reactive state
const chartRef = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);

// Interface for employee score data
interface EmployeeScoreData {
  employee: Employee;
  totalScore: number;
  scoreCount: number;
  averageScore: number;
}

// Computed property for employee score statistics
const employeeScoreData = computed((): EmployeeScoreData[] => {
  if (!employees.value.length || !scores.value.length) return [];
  
  const scoresByEmployee = new Map<number, Score[]>();
  
  // Group scores by employee
  scores.value.forEach(score => {
    if (!scoresByEmployee.has(score.employeeId)) {
      scoresByEmployee.set(score.employeeId, []);
    }
    scoresByEmployee.get(score.employeeId)!.push(score);
  });
  
  // Calculate totals for each employee
  return employees.value.map(employee => {
    const employeeScores = scoresByEmployee.get(employee.id) || [];
    const totalScore = employeeScores.reduce((sum, score) => sum + score.score, 0);
    const scoreCount = employeeScores.length;
    const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
    
    return {
      employee,
      totalScore,
      scoreCount,
      averageScore
    };
  }).sort((a, b) => b.totalScore - a.totalScore); // Sort by total score descending
});

// Computed property for general statistics
const employeeStats = computed(() => {
  const data = employeeScoreData.value;
  return {
    totalEmployees: data.length,
    totalScore: data.reduce((sum, item) => sum + item.totalScore, 0),
    averageScore: data.length > 0 
      ? data.reduce((sum, item) => sum + item.averageScore, 0) / data.length 
      : 0
  };
});

// Function to load employee images as base64
const loadImageAsBase64 = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 40;
      canvas.height = 40;
      
      if (ctx) {
        // Draw a circle clipping path
        ctx.beginPath();
        ctx.arc(20, 20, 20, 0, 2 * Math.PI);
        ctx.clip();
        
        // Draw the image
        ctx.drawImage(img, 0, 0, 40, 40);
        
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => {
      // Return a default avatar if image fails to load
      resolve(generateDefaultAvatar(imageUrl));
    };
    
    // Handle different image sources
    if (imageUrl.startsWith('data:')) {
      img.src = imageUrl;
    } else if (imageUrl.startsWith('http')) {
      img.src = imageUrl;
    } else {
      // Assume it's a local path
      img.src = imageUrl;
    }
  });
};

// Generate a default avatar with initials
const generateDefaultAvatar = (name: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 40;
  canvas.height = 40;
  
  if (ctx) {
    // Background
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(0, 0, 40, 40);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const initials = name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    ctx.fillText(initials, 20, 20);
  }
  
  return canvas.toDataURL('image/png');
};

// Chart initialization function
const initChart = async (dom: HTMLDivElement) => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  
  chartInstance.value = echarts.init(dom);
  
  const data = employeeScoreData.value;
  
  if (data.length === 0) {
    const emptyOption: EChartsOption = {
      title: {
        text: 'No hay datos disponibles',
        left: 'center',
        top: 'middle',
        textStyle: {
          fontSize: 18,
          color: '#666'
        }
      }
    };
    chartInstance.value.setOption(emptyOption);
    return;
  }
  
  // Prepare chart data
  const categories = data.map(item => item.employee.name);
  const values = data.map(item => item.totalScore);
  const images: string[] = [];
  
  // Load images for each employee
  for (const item of data) {
    try {
      const imageBase64 = item.employee.imageBytes 
        ? await loadImageAsBase64(item.employee.imageBytes)
        : await Promise.resolve(generateDefaultAvatar(item.employee.name));
      images.push(imageBase64);
    } catch (err) {
      console.warn('Failed to load image for', item.employee.name, err);
      images.push(generateDefaultAvatar(item.employee.name));
    }
  }
  
  const option: EChartsOption = {
    title: {
      text: 'Puntuaciones Totales por Palomo',
      left: 'center',
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const item = data[dataIndex];
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${item.employee.name}</div>
            <div>Puntuación Total: <span style="color: #3B82F6; font-weight: bold;">${item.totalScore}</span></div>
            <div>Número de Evaluaciones: ${item.scoreCount}</div>
            <div>Promedio: ${item.averageScore.toFixed(1)}</div>
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 12,
        color: '#374151'
      },
      axisLine: {
        lineStyle: {
          color: '#D1D5DB'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Puntuación Total',
      nameTextStyle: {
        color: '#374151',
        fontSize: 14
      },
      axisLabel: {
        color: '#374151'
      },
      axisLine: {
        lineStyle: {
          color: '#D1D5DB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6'
        }
      }
    },
    series: [
      {
        name: 'Puntuación Total',
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3B82F6' },
              { offset: 1, color: '#1D4ED8' }
            ])
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          color: '#374151',
          fontSize: 12,
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#60A5FA' },
              { offset: 1, color: '#3B82F6' }
            ])
          }
        }
      }
    ],
    graphic: images.map((image, index) => ({
      type: 'image',
      style: {
        image: image,
        width: 30,
        height: 30
      },
      position: [
        // Calculate position based on chart grid and bar position
        `${((index + 0.5) / categories.length) * 100}%`,
        '85%'
      ]
    }))
  };
  
  chartInstance.value.setOption(option);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });
};

// Load data function
const loadData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      fetchEmployees(),
      fetchScores()
    ]);
    
    // Wait for next tick to ensure DOM is updated
    await nextTick();
    
    if (chartRef.value) {
      await initChart(chartRef.value);
    }
  } catch (err: any) {
    console.error('Error loading data:', err);
    error.value = err.message || 'Error al cargar los datos';
  } finally {
    loading.value = false;
  }
};

// Initialize the chart when the component is mounted
onMounted(async () => {
  await loadData();
});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener('resize', () => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .chart-container {
    min-height: 300px;
  }
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive text */
@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
  
  p {
    font-size: 1rem;
  }
}
</style>