<script setup lang="ts">
import { defineProps, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

// Регистрируем компоненты Chart.js
Chart.register(...registerables);

// Типизируем пропсы для orders
const props = defineProps<{
  orders: Array<{
    date: string;
    total_price: string;
  }>;
}>();

let chartInstance: any = null;

// Инициализация графика
onMounted(() => {
  const ctx = document.getElementById("ordersChart") as HTMLCanvasElement;
  if (ctx && props.orders.length > 0) {
    const data = {
      labels: props.orders.map(order => order.date),
      datasets: [{
        label: 'Сумма заказов',
        data: props.orders.map(order => parseFloat(order.total_price)),
        borderColor: '#42b883',
        backgroundColor: 'rgba(66, 184, 131, 0.2)',
        fill: true,
      }]
    };

    const options = {
      scales: {
        x: { 
          title: { display: true, text: 'Дата' },
          grid: { display: false }
        },
        y: {
          title: { display: true, text: 'Сумма заказов' },
          grid: { color: '#ddd' }
        }
      }
    };

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data,
      options
    });
  }
});
</script>

<template>
  <div class="chart-container">
    <canvas id="ordersChart"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  height: 400px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  width: 100%;
}
</style>
