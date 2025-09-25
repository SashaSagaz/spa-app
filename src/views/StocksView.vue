<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getStocks } from '../services/api';
import DataChart from '../components/DataChart.vue';

// Интерфейс данных для склада
interface Stock {
  date: string;
  warehouse_name: string;
  barcode: number;
  quantity_full: number;
  price: string;
}

// Ссылки на данные
const stocks = ref<Stock[]>([]);
const loading = ref(true);
const selectedDateFrom = ref(new Date().toISOString().split("T")[0]);
const selectedDateTo = ref(new Date().toISOString().split("T")[0]);
const searchQuery = ref('');

// Функция для получения данных из API
async function fetchStocks() {
  loading.value = true;
  try {
    const res = await getStocks({
      dateFrom: selectedDateFrom.value,
      dateTo: selectedDateTo.value,
      limit: 50,
    });
    stocks.value = res.data.data;
    console.log("📦 Stocks API response:", res.data.data);
  } catch (e) {
    console.error("❌ Ошибка запроса Stocks:", e);
  } finally {
    loading.value = false;
  }
}

// Фильтрация по запросу поиска (по складу или штрихкоду)
const filteredStocks = computed(() => {
  return stocks.value.filter(stock => {
    const query = searchQuery.value.toLowerCase();
    return (
      stock.warehouse_name.toLowerCase().includes(query) ||
      stock.barcode.toString().includes(query)
    );
  });
});

onMounted(fetchStocks);
</script>

<template>
  <div class="page">
    <h1 class="title">📊 Stocks (остатки)</h1>

    <!-- Фильтры даты -->
    <div class="filter-box">
      <div class="date-picker">
        <label>Дата с:</label>
        <input type="date" v-model="selectedDateFrom" />
      </div>

      <div class="date-picker">
        <label>Дата по:</label>
        <input type="date" v-model="selectedDateTo" />
      </div>

      <button class="btn" @click="fetchStocks">Обновить</button>
    </div>

    <!-- График -->
    <div class="chart-box">
      <DataChart
        :labels="stocks.map(s => s.warehouse_name)"
        :values="stocks.map(s => s.quantity_full)"
      />
    </div>

    <!-- Поиск -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Поиск по складу или штрихкоду"
        class="search-input"
      />
    </div>
    
    <!-- Загрузка -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Таблица с данными -->
    <div v-else>
      <div v-if="filteredStocks.length === 0">
        ⚠️ Данных нет на выбранную дату
      </div>

      <div v-else>
        <!-- Таблица -->
        <div class="table-box">
          <table class="data-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Склад</th>
                <th>Штрихкод</th>
                <th>Остаток</th>
                <th>Цена ₽</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in filteredStocks" :key="s.barcode">
                <td>{{ s.date }}</td>
                <td>{{ s.warehouse_name }}</td>
                <td>{{ s.barcode }}</td>
                <td>{{ s.quantity_full }}</td>
                <td>{{ s.price }}</td>
              </tr>
            </tbody>
          </table>
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

/* Поиск */
.search-box {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
}

.search-input {
    padding: 0.8rem;
    border: 3px solid #f5f5f5;
    border-radius: 16px;
    width: 100%;
    font-size: 1rem;
    transition: 0.2s;
}

.search-input:focus {
  outline: 2px solid #42b883;
}

/* Загрузка */
.loading {
  font-size: 1.2rem;
  color: #555;
}

/* Карточка для графика */
.chart-box {
  height: 400px;
  /* background: white; */
  padding: 1rem;
  border-radius: 8px;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  margin-bottom: 3rem;
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
</style>
