<template>
  <div class="products-wrapp">
    <h4 @click="resetSelection">
      {{ currentView === 'products' ? selectedCategory.name : 
         currentView === 'subcategories' ? selectedParent.name : 
         'Все категории' }}
    </h4>
    
    <!-- Отображение родительских категорий -->
    <div v-if="currentView === 'parents'" class="product-list">
      <div 
        v-for="parent in parentCategories" 
        :key="parent.id" 
        class="card" 
        @click="selectParent(parent)"
      >
        <div class="card-body">
          <img 
            v-if="parent.image_url" 
            :src="getImageUrl(parent.image_url)" 
            :alt="parent.name"
            class="product-image"
            @error="handleImageError"
          >
          <div v-else class="no-image">Нет изображения</div>
          <div class="card-buy">
            <img src="/src/assets/img/eye.svg" alt="Купить" class="cart-icon">
            <span class="buy-text">Перейти</span>
          </div>
        </div>
        <h5>{{ parent.name }}</h5>
      </div>
    </div>
    
    <!-- Отображение подкатегорий -->
    <div v-else-if="currentView === 'subcategories'" class="product-list">
      <div 
        v-for="child in childCategories" 
        :key="child.id" 
        class="card" 
        @click="selectChild(child)"
      >
        <div class="card-body">
          <img 
            v-if="child.image_url" 
            :src="getImageUrl(child.image_url)" 
            :alt="child.name"
            class="product-image"
            @error="handleImageError"
          >
          <div v-else class="no-image">Нет изображения</div>
          <div class="card-buy">
            <img src="/src/assets/img/eye.svg" alt="Купить" class="cart-icon">
            <span class="buy-text">Перейти</span>
          </div>
        </div>
        <h5>{{ child.name }}</h5>
      </div>
    </div>
    
    <!-- Отображение товаров -->
    <div v-else-if="currentView === 'products'" class="product-list">
      <div v-if="props.products.length === 0">
        <h5>Товары не найдены</h5>
      </div>
      <div 
        v-else
        v-for="product in products" 
        :key="product.id" 
        class="card" 
        @click="goToProduct(product.id)"
      >
        <div class="card-body">
          <img 
            v-if="product.image_url" 
            :src="getImageUrl(product.image_url)" 
            :alt="product.name"
            class="product-image"
            @error="handleImageError"
          >
          <div v-else class="no-image">Нет изображения</div>
          <div class="card-buy">
            <img src="/src/assets/img/cart.svg" alt="Купить" class="cart-icon">
            <span class="buy-text">Заказать</span>
          </div>
        </div>
        <h5>{{ product.name }}</h5>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchProductsByCategory, fetchChildCategories } from '../../../src/services/api.service';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  parentCategories: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  products: {
    type: Array,
    default: () => []
  }
});
console.log("PROPS in CatalogProducts:", {
  parentCategories: props.parentCategories,
  categories: props.categories
});
const emit = defineEmits(['reset', 'view-change']);

const products = ref([]);
const childCategories = ref([]);
const selectedParent = ref(null);
const selectedCategory = ref(null);
const currentView = ref('parents');

// Функция для получения корректного URL изображения
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log("Empty image path");
    return '';
  }
  
  if (imagePath.startsWith('http')) {
    console.log("Absolute image path:", imagePath);
    return imagePath;
  }
  
  const cleanPath = imagePath.replace(/^\/+/, '');
  const fullUrl = `http://voenerdgy.ru/${cleanPath}`;
  console.log("Generated image URL:", fullUrl);
  return fullUrl;
};

// Обработчик ошибок загрузки изображения
const handleImageError = (event) => {
  event.target.style.display = 'none';
  const noImageDiv = event.target.nextElementSibling;
  if (noImageDiv && noImageDiv.classList.contains('no-image')) {
    noImageDiv.style.display = 'flex';
  }
};

const goToProduct = (productId) => {
  router.push({ 
    name: 'product', 
    params: { id: productId } 
  });
};

const selectParent = async (parent) => {
  selectedParent.value = parent;
  try {
    childCategories.value = await fetchChildCategories(parent.id);
    currentView.value = 'subcategories';
    router.push({ 
      name: 'catalog', 
      query: { parent: parent.id } 
    });
  } catch (error) {
    console.error('Ошибка при загрузке подкатегорий:', error);
  }
};

const selectChild = async (child) => {
  selectedCategory.value = child;
  try {
    // Отладочная информация
    console.log("All products with categories:", 
      props.products.map(p => ({id: p.id, name: p.name, category_id: p.category_id})));
    console.log("Current category ID:", child.id);
    
    // Вариант 1: Фильтрация с приведением типов
    products.value = props.products.filter(p => Number(p.category_id) === Number(child.id));
    
    // Или Вариант 2: Загрузка из API (предпочтительно)
    // products.value = await fetchProductsByCategory(child.id);
    
    console.log("Filtered products:", products.value);
    
    currentView.value = 'products';
    router.push({ 
      name: 'catalog', 
      query: { 
        parent: child.parent_id,
        child: child.id
      } 
    });
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    products.value = [];
  }
};

const resetSelection = () => {
  selectedParent.value = null;
  selectedCategory.value = null;
  currentView.value = 'parents';
  emit('reset');
  router.push({ name: 'catalog' });
};

// Обработка начального состояния при загрузке страницы
onMounted(() => {
  if (route.query.child) {
    const childId = parseInt(route.query.child);
    const child = props.categories.find(c => c.id === childId);
    if (child) {
      selectedCategory.value = child;
      selectChild(child);
    }
  } else if (route.query.parent) {
    const parentId = parseInt(route.query.parent);
    const parent = props.parentCategories.find(p => p.id === parentId);
    if (parent) {
      selectParent(parent);
    }
  }
});

// Отслеживание изменений в route
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.child) {
      const childId = parseInt(newQuery.child);
      const child = props.categories.find(c => c.id === childId);
      if (child && (!selectedCategory.value || selectedCategory.value.id !== childId)) {
        selectChild(child);
      }
    } else if (newQuery.parent) {
      const parentId = parseInt(newQuery.parent);
      const parent = props.parentCategories.find(p => p.id === parentId);
      if (parent && (!selectedParent.value || selectedParent.value.id !== parentId)) {
        selectParent(parent);
      }
    } else {
      resetSelection();
    }
  }
);

watch(currentView, (newView) => {
  emit('view-change', newView === 'products'); // Отправляем true/false
}, { immediate: true });

</script>
<style scoped>
/* Стили остаются такими же, как в вашем исходном коде */
.products-wrapp {
  background-color: var(--primary-white-color);
  padding: 15px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

h4 {
  color: var(--primary-orange-color);
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

h4:hover {
  color: var(--primary-orange-dark);
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  justify-items: center;
}

.card {
  width: 100%;
  max-width: 193px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.card h5 {
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  margin: 0;
  padding: 0 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Ограничиваем количество строк */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 48px; /* Фиксированная высота */
  line-height: 1.2; /* Межстрочный интервал */
  min-height: 48px; /* Минимальная высота на всякий случай */
  max-height: 48px; /* Максимальная высота */
}

.card-body {
  background-color: var(--primary-dark-gray);
  border-radius: 12px;
  position: relative;
  box-shadow: 0 2px 12px 0 var(--black-opacity-color);
  width: 100%;
  height: 140px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s;
}

.card:hover .product-image {
  transform: scale(1.03);
}

.card-buy {
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background-color: var(--primary-black-color);
  top: 65%;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 0;
}

.cart-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.buy-text {
  color: white;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  width: 0;
  transition: all 0.3s ease;
  margin-left: 0;
}

.card:hover .card-buy {
  width: 75px;
  padding: 0 8px;
  justify-content: flex-start;
}

.card:hover .cart-icon {
  margin-right: 5px;
}

.card:hover .buy-text {
  opacity: 1;
  width: auto;
  margin-left: 5px;
}

h5 {
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  margin: 0;
  padding: 0 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 48px;
}

@media (min-width: 400px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .card-body {
    height: 150px;
  }
  
  .card-buy {
    top: 65%;
  }
  
  h5 {
    font-size: 14px;
  }
}

@media (min-width: 576px) {
  .products-wrapp {
    padding: 20px;
  }
  
  h4 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 18px;
  }
  
  .card-body {
    height: 160px;
    border-radius: 15px;
  }
  
  .card-buy {
    width: 24px;
    height: 24px;
    right: -10px;
  }
  
  .cart-icon {
    width: 16px;
    height: 16px;
  }
  
  .buy-text {
    font-size: 12px;
  }
  
  .card:hover .card-buy {
    width: 85px;
  }
}

@media (min-width: 768px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
  
  .card-body {
    height: 180px;
  }
  
  h5 {
    font-size: 15px;
    min-height: 60px;
  }
}

@media (min-width: 992px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(193px, 1fr));
  }
  
  .card-body {
    height: 193px;
  }
  
  .card-buy {
    right: -11px;
    top: 70%;
  }
  
  .card:hover .card-buy {
    width: 90px;
  }
}
</style>