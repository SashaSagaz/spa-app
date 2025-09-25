<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const props = defineProps<{
  labels: string[];
  values: number[];
}>();
</script>

<template>
  <div class="chart-container">
    <Line
      :data="{
        labels: props.labels,
        datasets: [
          {
            label: 'Остатки товара',
            data: props.values,
            borderColor: '#42b883',
            backgroundColor: 'rgba(66, 184, 131, 0.2)',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#42b883',
            pointHoverBackgroundColor: '#36a372'
          }
        ]
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'График остатков товара' }
        },
        scales: {
          x: { 
            title: { display: true, text: 'Склад' },
            grid: { display: false }
          },
          y: { 
            title: { display: true, text: 'Количество' },
            grid: { color: '#ddd' }
          }
        }
      }"
    />
  </div>
</template>

<style scoped>
.chart-container {
  height: 400px;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

canvas {
  width: 100%;
  height: 100%;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #333;
}
</style>
