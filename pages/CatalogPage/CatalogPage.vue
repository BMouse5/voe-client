<template>
  <NavBar :parentCategories="parentCategories"></NavBar>
  <section class="catalog">
    <div class="catalog-wrapp container">
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
          :products="filteredProducts"
          :selected-category="selectedCategoryId"
        ></CatalogProducts>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '../../src/components/NavBar.vue'
import CatalogCategories from './components/CatalogCategories.vue'
import CatalogProducts from './components/CatalogProducts.vue'

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
})

const selectedCategoryId = ref(null)

const filteredProducts = computed(() => {
  // Если категория не выбрана - возвращаем все товары
  if (!selectedCategoryId.value) return props.products
  
  // Получаем все дочерние категории для выбранной
  const childCategories = props.categories.filter(
    cat => cat.parent_id === selectedCategoryId.value
  ).map(cat => cat.id)
  
  // Добавляем саму выбранную категорию
  const categoriesToFilter = [selectedCategoryId.value, ...childCategories]
  
  return props.products.filter(
    product => categoriesToFilter.includes(product.category_id)
  )
})

const handleCategorySelect = (categoryId) => {
  selectedCategoryId.value = categoryId
}

const resetCategory = () => {
  selectedCategoryId.value = null
}
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
    padding: 40px 0;
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