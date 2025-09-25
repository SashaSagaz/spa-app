import axios from "axios";

const API_URL = "http://109.73.206.144:6969/api";
const API_KEY = "E6kUTYrYwZq2tN4QEtyzsbEBk3ie";

// обёртка для добавления ключа в query
function withKey(params: Record<string, any> = {}) {
  return { ...params, key: API_KEY };
}

export const getIncomes = (params?: any) =>
  axios.get(`${API_URL}/incomes`, { params: withKey(params) });

export const getOrders = (params?: any) =>
  axios.get(`${API_URL}/orders`, { params: withKey(params) });

export const getSales = (params?: any) =>
  axios.get(`${API_URL}/sales`, { params: withKey(params) });

export const getStocks = (params?: any) =>
  axios.get(`${API_URL}/stocks`, { params: withKey(params) });