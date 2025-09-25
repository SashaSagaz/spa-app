<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getOrders } from "../services/api";
import OrdersChart from "../components/OrdersChart.vue";

interface Order {
  g_number: string;
  date: string;
  total_price: string;
  discount_percent: number;
  warehouse_name: string;
  oblast: string;
}

const orders = ref<Order[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);

const fromDate = ref("2024-10-01");
const toDate = ref("2024-10-12");

// Функция для загрузки заказов
async function fetchOrders(p: number = 1) {
  loading.value = true;
  try {
    const res = await getOrders({
      dateFrom: fromDate.value,
      dateTo: toDate.value,
      page: p,
      limit: 10,
    });
    orders.value = res.data.data;
    totalPages.value = res.data.meta.last_page;
    page.value = res.data.meta.current_page;
  } catch (e) {
    console.error("Ошибка запроса:", e);
  } finally {
    loading.value = false;
  }
}

// Слушаем изменения фильтров
watch([fromDate, toDate], () => {
  fetchOrders();
});

onMounted(() => fetchOrders()); // Загрузка данных при монтировании
</script>

<template>
  <div class="orders-page">
    <h1>📦 Заказы</h1>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else>
      <!-- Фильтры -->
      <div class="filters">
        <input type="date" v-model="fromDate" />
        <input type="date" v-model="toDate" />
        <button @click="fetchOrders()">Применить</button>
      </div>

      <!-- График -->
      <OrdersChart :orders="orders" />

      <!-- Таблица заказов -->
      <table class="orders-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Скидка %</th>
            <th>Склад</th>
            <th>Регион</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.g_number">
            <td>{{ o.date }}</td>
            <td>{{ o.total_price }}</td>
            <td>{{ o.discount_percent }}</td>
            <td>{{ o.warehouse_name }}</td>
            <td>{{ o.oblast }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Пагинация -->
      <div class="pagination">
        <button @click="fetchOrders(page - 1)" :disabled="page === 1">Назад</button>
        <span>Страница {{ page }} из {{ totalPages }}</span>
        <button @click="fetchOrders(page + 1)" :disabled="page === totalPages">Вперёд</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 20px;
  background: #fafafa;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.orders-table th,
.orders-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}


.orders-table th {
  background: #f0f0f0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  background-color: #42b883;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
}
</style>
