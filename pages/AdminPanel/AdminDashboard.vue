<!-- src/pages/admin/AdminDashboard.vue -->
<template>
    <div class="admin-dashboard">
      <h2>Главная</h2>
      <div class="stats">
        <div class="stat-card">
          <h3>Всего товаров</h3>
          <p>{{ productsCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Всего категорий</h3>
          <p>{{ categoriesCount }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { fetchProducts, fetchCategories } from '../../src/services/api.service';
  
  const productsCount = ref(0);
  const categoriesCount = ref(0);
  
  onMounted(async () => {
    try {
      const products = await fetchProducts();
      const categories = await fetchCategories();
      productsCount.value = products.length;
      categoriesCount.value = categories.length;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  });
  </script>
  
  <style scoped>
  .admin-dashboard {
    padding: 1rem;
  }
  
  .stats {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .stat-card {
    flex: 1;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .stat-card h3 {
    margin-top: 0;
    color: #555;
  }
  
  .stat-card p {
    font-size: 2rem;
    font-weight: bold;
    margin: 0.5rem 0 0;
    color: #2c3e50;
  }
  </style>