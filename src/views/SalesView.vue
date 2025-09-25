<template>
  <div class="page">
    <h1 class="title">📊 Продажи</h1>

    <!-- Фильтры (Дата с, дата по, и поиск) -->
    <div class="filter-box">
      <!-- Дата с -->
      <div class="date-picker">
        <label>Дата с:</label>
        <input type="date" v-model="fromDate" class="filter-input" />
      </div>

      <!-- Дата по -->
      <div class="date-picker">
        <label>Дата по:</label>
        <input type="date" v-model="toDate" class="filter-input" />
      </div>

      <!-- Поиск -->
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск по складу или товару"
          class="search-input"
        />
      </div>

      <!-- Кнопка применения фильтров -->
      <button class="btn" @click="applyFilter">Применить</button>
    </div>

    <!-- Загрузка данных -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Отображение таблицы данных -->
    <div v-else>
      <div v-if="filteredSales.length === 0">
        ⚠️ Нет данных на выбранный период или фильтр
      </div>

      <div v-else>
        <!-- Таблица с данными -->
        <div class="table-box">
          <table class="data-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Склад</th>
                <th>Цена</th>
                <th>Цена с учетом скидки</th>
                <th>Скидка %</th>
                <th>ID товара</th>
                <th>Sale ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredSales" :key="sale.sale_id">
                <td>{{ sale.date }}</td>
                <td>{{ sale.warehouse_name }}</td>
                <td>{{ parseFloat(sale.total_price).toFixed(2) }}</td>
                <td>{{ parseFloat(sale.price_with_disc).toFixed(2) }}</td>
                <td>{{ sale.discount_percent }}</td>
                <td>{{ sale.nm_id }}</td>
                <td>{{ sale.sale_id }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Пагинация -->
        <div class="pagination">
          <button @click="fetchSales(page - 1)" :disabled="page === 1">Назад</button>
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <button @click="fetchSales(page + 1)" :disabled="page === totalPages">Вперёд</button>
        </div>

        <!-- График -->
        <div class="chart-box">
          <SalesChart
            :labels="filteredSales.map(sale => sale.date)"
            :values="filteredSales.map(sale => parseFloat(sale.price_with_disc))"
            :discounts="filteredSales.map(sale => sale.discount_percent)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getSales } from '../services/api';
import SalesChart from '../components/SalesChart.vue';

const sales = ref([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);

const fromDate = ref('2024-10-01');
const toDate = ref('2024-10-12');
const searchQuery = ref('');

// Функция для получения данных с сервера
async function fetchSales(p = 1) {
  loading.value = true;
  try {
    const res = await getSales({
      dateFrom: fromDate.value,
      dateTo: toDate.value,
      page: p,
      limit: 50,  // Увеличил количество данных
    });
    sales.value = res.data.data;
    totalPages.value = res.data.meta.last_page;
    page.value = res.data.meta.current_page;
  } finally {
    loading.value = false;
  }
}

// Применить фильтры
function applyFilter() {
  fetchSales(1);
}

// Поиск по складу или товару
const filteredSales = computed(() => {
  return sales.value.filter(sale => {
    const query = searchQuery.value.toLowerCase();
    return sale.warehouse_name.toLowerCase().includes(query) || sale.nm_id.toString().includes(query);
  });
});

onMounted(() => fetchSales());
</script>

<style scoped>
.page {
  padding: 20px;
  background: #fafafa;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, sans-serif;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

/* Фильтры даты */
.filter-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: end;
}

.date-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date-picker label {
  font-size: 1rem;
  color: #444;
}

input[type="date"] {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-top: 0.4rem;
  width: 150px;
}

.btn {
    background: #42b883;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.btn:hover {
    background: #36a372;
}

.search-box {
  display: flex;
  justify-content: center;
  flex: 1;
}

.search-input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 50%;
  font-size: 1rem;
  transition: 0.2s;
}

.search-input:focus {
  outline: 2px solid #42b883;
}

.btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background: #36a372;
}

/* Загрузка */
.loading {
  font-size: 1.2rem;
  color: #555;
}

/* Таблица */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.data-table th {
  background: #f0f0f0;
  color: #444;
  font-weight: 600;
}

.data-table tr:hover {
  background: #f9f9f9;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.pagination button:hover {
  background-color: #36a372;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Карточка для графика */
.chart-box {
  height: 400px;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
}
</style>