<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getIncomes } from '../services/api';
import IncomesChart from '../components/IncomesChart.vue';

// Интерфейс данных
interface Income {
  income_id: number;
  date: string;
  warehouse_name: string;
  barcode: number;
  quantity: number;
  total_price: string;
  date_close: string;
  last_change_date: string;
}

const incomes = ref<Income[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);

const fromDate = ref("2024-10-01");
const toDate = ref("2024-10-12");
const searchQuery = ref('');

// Функция для получения данных с сервера
async function fetchIncomes(p = 1) {
  loading.value = true;
  try {
    const res = await getIncomes({
      dateFrom: fromDate.value,
      dateTo: toDate.value,
      page: p,
      limit: 50,  // Увеличиваем лимит для данных
    });
    incomes.value = res.data.data;
    totalPages.value = res.data.meta.last_page;
    page.value = res.data.meta.current_page;
  } finally {
    loading.value = false;
  }
}

// Применить фильтры
function applyFilter() {
  fetchIncomes(1);
}

// Поиск по складу или товару
const filteredIncomes = computed(() => {
  return incomes.value.filter(income => {
    const query = searchQuery.value.toLowerCase();
    return income.warehouse_name.toLowerCase().includes(query) || income.barcode.toString().includes(query);
  });
});

onMounted(() => fetchIncomes());
</script>

<template>
  <div class="page">
    <h1 class="title">📊 Приходы</h1>

    <!-- Фильтры (Дата с, дата по, и поиск) -->
    <div class="filter-box">
      <div class="date-picker">
        <label>Дата с:</label>
        <input type="date" v-model="fromDate" class="filter-input" />
      </div>

      <div class="date-picker">
        <label>Дата по:</label>
        <input type="date" v-model="toDate" class="filter-input" />
      </div>

      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск по складу или товару"
          class="search-input"
        />
      </div>

      <button class="btn" @click="applyFilter">Применить</button>
    </div>

    <!-- Загрузка данных -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Отображение таблицы данных -->
    <div v-else>
      <div v-if="filteredIncomes.length === 0">
        ⚠️ Нет данных на выбранный период или фильтр
      </div>

      <div v-else>
        <!-- Таблица с данными -->
        <div class="table-box">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Склад</th>
                <th>Штрихкод</th>
                <th>Кол-во</th>
                <th>Сумма</th>
                <th>Дата закрытия</th>
                <th>Дата изменения</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="income in filteredIncomes" :key="income.income_id">
                <td>{{ income.income_id }}</td>
                <td>{{ income.date }}</td>
                <td>{{ income.warehouse_name }}</td>
                <td>{{ income.barcode }}</td>
                <td>{{ income.quantity }}</td>
                <td>{{ parseFloat(income.total_price).toFixed(2) }}</td>
                <td>{{ income.date_close }}</td>
                <td>{{ income.last_change_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Пагинация -->
        <div class="pagination">
          <button @click="fetchIncomes(page - 1)" :disabled="page === 1">Назад</button>
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <button @click="fetchIncomes(page + 1)" :disabled="page === totalPages">Вперёд</button>
        </div>

        <!-- График -->
        <div class="chart-box">
          <IncomesChart
            :labels="filteredIncomes.map(income => income.date)"
            :values="filteredIncomes.map(income => income.quantity)"
            />
        </div>
      </div>
    </div>
  </div>
</template>

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

/* Фильтры (дата и поиск) */
.filter-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.date-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 150px;
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
  width: 100%;
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
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}
</style>
