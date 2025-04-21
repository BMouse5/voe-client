<template>
  <div>
    <router-view 
  :products="products" 
  :categories="categories"
      :parentCategories="parentCategories"
      :loading="loading"
    ></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { fetchProducts, fetchCategories } from './services/api.service';
import './style.css'
const products = ref(inject('initialProducts', []))
const categories = ref(inject('initialCategories', []))
const parentCategories = ref([]);
const loading = ref(true);

onMounted(async () => {
  if (products.value.length === 0 || categories.value.length === 0) {
    loading.value = true
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
      products.value = productsData
      categories.value = categoriesData
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      loading.value = false
    }
  }

  parentCategories.value = categories.value.filter(c => c.parent_id === null)
})
</script>

<style>
/* Глобальные стили */
</style>