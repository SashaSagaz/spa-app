import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import IncomesView from "../views/IncomesView.vue";
import OrdersView from "../views/OrdersView.vue";
import SalesView from "../views/SalesView.vue";
import StocksView from "../views/StocksView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/incomes", component: IncomesView },
  { path: "/orders", component: OrdersView },
  { path: "/sales", component: SalesView },
  { path: "/stocks", component: StocksView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;