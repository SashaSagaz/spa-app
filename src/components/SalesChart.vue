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
  discounts: number[];
}>();
</script>

<template>
  <div class="chart-container">
    <Line
      :data="{
        labels: props.labels,
        datasets: [
          {
            label: 'Цена с учетом скидки',
            data: props.values,
            borderColor: '#42b883',
            backgroundColor: 'rgba(66, 184, 131, 0.2)',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#42b883',
            pointHoverBackgroundColor: '#36a372',
            yAxisID: 'y1'
          },
          {
            label: 'Скидка',
            data: props.discounts,
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#f44336',
            pointHoverBackgroundColor: '#e53935',
            yAxisID: 'y2'
          }
        ]
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Продажи с учетом скидок и процентов' }
        },
        scales: {
          x: {
            title: { display: true, text: 'Дата' },
            grid: { display: false }
          },
          y1: {
            title: { display: true, text: 'Цена с учетом скидки (₽)' },
            ticks: { beginAtZero: true },
            grid: { borderColor: '#ddd' }
          },
          y2: {
            title: { display: true, text: 'Скидка (%)' },
            ticks: { beginAtZero: true },
            grid: { borderColor: '#ddd' },
            position: 'right'
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
