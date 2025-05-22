<template>
    <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
  <div>
  <NavBar :parentCategories="parentCategories"></NavBar>
  <section class="catalog">
    <div class="catalog-wrapp container">
      <input 
      type="text" 
      placeholder="Поиск товара" 
      v-if="currentView" 
      class="search-input"
      v-model="searchQuery"
      >
      <div class="categories-wrapp">
        <CatalogCategories 
          :categories="categories" 
          :parentCategories="parentCategories"
          @select-category="handleCategorySelect"
          @reset-category="resetCategory"
        ></CatalogCategories>
      </div>
      <div class="product-wrapp">
        <CatalogProducts 
  :parent-categories="parentCategories"
  :categories="categories"
  :products="filteredProducts"
  @select-parent="handleParentSelect"
  @select-child="handleChildSelect"
  @reset="handleReset"
  @view-change="searchProducts"
></CatalogProducts>
      </div>
    </div>
  </section>
  <FooterComp :parentCategories="parentCategories"></FooterComp>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '../../src/components/NavBar.vue';
import FooterComp from '../../src/components/FooterComp.vue';
import CatalogCategories from './components/CatalogCategories.vue';
import CatalogProducts from './components/CatalogProducts.vue';

const route = useRoute();
const selectedCategoryId = ref(null);
const currentView = ref(null)
const searchQuery = ref('')
const searchProducts = (view) => {
  currentView.value = view
  if (!view) {
    searchQuery.value = ''
  }
}

// Обработка query-параметра при загрузке
onMounted(() => {
  if (route.query.category) {
    selectedCategoryId.value = parseInt(route.query.category);
  }
});

// Отслеживаем изменения route
watch(
  () => route.query.category,
  (newCategoryId) => {
    if (newCategoryId) {
      selectedCategoryId.value = parseInt(newCategoryId);
    } else {
      selectedCategoryId.value = null;
    }
  }
);

const filteredProducts = computed(() => {
  // Начинаем со всех товаров или отфильтрованных по категории
  let filtered = props.products;
  
  // 1. Сначала фильтруем по категории (если выбрана)
  if (selectedCategoryId.value) {
    const childCategoryIds = props.categories
      .filter(cat => cat.parent_id === selectedCategoryId.value)
      .map(cat => cat.id);
    
    const categoriesToFilter = [selectedCategoryId.value, ...childCategoryIds];
    filtered = filtered.filter(product => 
      categoriesToFilter.includes(product.category_id)
    );
  }
  
  // 2. Затем фильтруем по первой букве (если есть запрос)
  if (searchQuery.value.trim()) {
    const firstLetter = searchQuery.value.trim().toLowerCase()[0];
    filtered = filtered.filter(product => {
      const productName = product.name?.toLowerCase() || '';
      return productName.startsWith(firstLetter);
    });
  }
  
  return filtered;
});

watch(searchQuery, () => {
  console.log("Search query changed:", searchQuery.value);
});

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
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const handleParentSelect = (parent) => {
  selectedCategoryId.value = parent.id;
};

const handleChildSelect = (child) => {
  selectedCategoryId.value = child.id;
  // Дополнительная логика если нужно
};

const handleReset = () => {
  selectedCategoryId.value = null;
};
</script>

<style scoped>
.catalog {
  background-color: var(--primary-dark-gray);
  padding: 20px 0;
}

.catalog-wrapp {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  min-height: 100vh;
  position:relative;
  margin-top: 35px;
}
.search-input {
  position: absolute;
  top: -45px;
  right: 20px;
  border-radius: 20px;
  padding: 10px;
  border: none;
}

.search-input:focus {
  border: 1px solid var(--primary-orange-color);
}

.categories-wrapp {
  width: 100%;
  max-width: 100%;

}

.product-wrapp {
  width: 100%;
  max-width: 100%;

}

/* Планшетная версия */
@media (min-width: 768px) {
  .catalog {
    padding: 20px 0;
  }
  
  .catalog-wrapp {
    flex-direction: row;
    gap: 30px;
    padding: 0 20px;
  }
  
  .categories-wrapp {
    max-width: 300px;

  }
  
  .product-wrapp {
    max-width: calc(100% - 330px);

  }
}

/* Десктопная версия */
@media (min-width: 992px) {
  .catalog {
    padding: 60px 0;
  }
  
  .catalog-wrapp {
    max-width: 1200px;
    margin: 0 auto;
    gap: 40px;
  }
  
  .categories-wrapp {
    max-width: 350px;
  }
  
  .product-wrapp {
    max-width: calc(100% - 390px);
  }
}

/* Большие экраны */
@media (min-width: 1200px) {
  .catalog-wrapp {
    gap: 60px;
  }
  
  .categories-wrapp {
    max-width: 431px;
  }
  
  .product-wrapp {
    max-width: 851px;
  }
}
</style>