<template>
  <div>
    <nav style="margin-bottom: 20px;">
      <router-link to="/incomes">Incomes</router-link> |
      <router-link to="/orders">Orders</router-link> |
      <router-link to="/sales">Sales</router-link> |
      <router-link to="/stocks">Stocks</router-link>
    </nav>
    <!-- подставляем активную страницу -->
    <router-view />
  </div>
</template>

<style scoped>
nav {
  padding: 1rem;
  background: #f4f4f4;
  border-bottom: 1px solid #ddd;
}

a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

a.router-link-exact-active {
  color: #42b883;
}
</style>
