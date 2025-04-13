<template>
  <div id="app">
    <router-view 
      :products="products" 
      :categories="categories" 
      :parentCategories="parentCategories"
      :loading="loading"
    ></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchProducts, fetchCategories } from './services/api.service';

const products = ref([]);
const categories = ref([]);
const parentCategories = ref([]);
const loading = ref(true);

const loadData = async () => {
  try {
    loading.value = true;
    const [productsData, categoriesData] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);
    products.value = productsData;
    categories.value = categoriesData;
    parentCategories.value = categoriesData.filter(category => category.parent_id === null);
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style>
/* Глобальные стили */
</style>