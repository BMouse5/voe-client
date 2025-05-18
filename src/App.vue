<template>
  <div>
    <router-view class="wrapper" 
      :products="products" 
      :categories="categories"
      :parentCategories="parentCategories"
      :loading="loading"
    ></router-view>
  </div>
  <div 
    class="basket" 
    @mouseenter="shakeBasket"
    v-if="!isAdminRoute"
    @click="toBasket"
  >
    <img src="./assets/img/cart.svg" alt="">
    <span class="cart-badge" v-if="cartStore.totalItems > 0">
      {{ cartStore.totalItems }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Импортируем useRoute
import { fetchProducts, fetchCategories } from './services/api.service';
import { useCartStore } from './store/cartStore';
import './style.css'

const route = useRoute(); // Получаем текущий маршрут
const router = useRouter()
const products = ref(inject('initialProducts', []))
const categories = ref(inject('initialCategories', []))
const parentCategories = ref([]);
const loading = ref(true);
const cartStore = useCartStore()

// Вычисляемое свойство для проверки админского пути
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin') || route.path.startsWith('/basket')
});

const shakeBasket = (e) => {
  const basket = e.currentTarget;
  basket.classList.add('shake');
  setTimeout(() => {
    basket.classList.remove('shake');
  }, 1000);
}

const toBasket = () => {
  router.push('/basket')
}

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

<style scoped>
.wrapper {
  position: relative;
}
.basket {
  border-radius: 50%;
  background-color: var(--primary-dark-gray);
  position:fixed;
  bottom: 30px;
  right: 30px;
  padding: 5px;
  box-shadow: 0px 0px 20px 2px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.basket:hover {
  transform: scale(1.1);
}

.basket.shake {
  animation: shake 1s cubic-bezier(.36,.07,.19,.97) both;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: rgb(236, 71, 5);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) scale(1.1);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px) rotate(-5deg) scale(1.1);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px) rotate(5deg) scale(1.1);
  }
}

img {
  width: 40px;
  height: 40px;
}
</style>