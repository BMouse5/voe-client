<template>
    <div class="categories-wrapp">
      <div class="mobile-category-toggle" @click="toggleMobileMenu">
        <h4>Каталог</h4>
        <svg
          class="arrow-icon"
          :class="{ open: mobileMenuOpen }"
          width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
        >
        <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
        </svg>
      </div>
      
      <div class="categories-list" :class="{ 'mobile-open': mobileMenuOpen }">
        <div
          v-for="parent in parentCategories"
          :key="parent.id"
          class="categories-item"
        >
          <div class="accordion-header" :class="{ open: isOpen[parent.id] }" @click="toggleParentCategory(parent.id)">
            <span :class="{ open: isOpen[parent.id] }">{{ parent.name }}</span>
            <svg
              class="arrow-icon"
              :class="{ open: isOpen[parent.id] }"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <ul
            v-if="getChildren(parent.id).length"
            :class="{ open: isOpen[parent.id] }"
            :style="{ 'max-height': isOpen[parent.id] ? '500px' : '0' }"
          >
            <li 
              v-for="child in getChildren(parent.id)" 
              :key="child.id"
              @click.stop="selectChildCategory(child.id, parent.id)"
            >
              {{ child.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  parentCategories: {
    type: Array,
    default: () => []
  }
});

const mobileMenuOpen = ref(false);
const isOpen = ref({});
const selectedParentId = ref(null);

// Закрываем все категории перед открытием новой
const closeAllCategories = () => {
  Object.keys(isOpen.value).forEach(key => {
    isOpen.value[key] = false;
  });
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const emit = defineEmits(['select-category', 'reset-category']);

const findParentCategory = (childId) => {
  const childCategory = props.categories.find(cat => cat.id === childId);
  return childCategory ? childCategory.parent_id : null;
};

onMounted(() => {
  if (route.query.category) {
    const categoryId = parseInt(route.query.category);
    handleInitialCategory(categoryId);
  }
});

const handleInitialCategory = (categoryId) => {
  // Закрываем все категории перед обработкой новой
  closeAllCategories();
  
  const isParent = props.parentCategories.some(cat => cat.id === categoryId);
  
  if (isParent) {
    selectedParentId.value = categoryId;
    isOpen.value[categoryId] = true;
    emit('select-category', categoryId);
  } else {
    const parentId = findParentCategory(categoryId);
    if (parentId) {
      selectedParentId.value = parentId;
      isOpen.value[parentId] = true;
      emit('select-category', categoryId);
    }
  }
};

watch(
  () => route.query.category,
  (newCategoryId, oldCategoryId) => {
    // Закрываем все категории только если параметр изменился
    if (newCategoryId !== oldCategoryId) {
      if (newCategoryId) {
        const categoryId = parseInt(newCategoryId);
        handleInitialCategory(categoryId);
      } else {
        resetCategory();
      }
    }
  },
  { immediate: true }
);

const toggleParentCategory = (id) => {
  router.push({ 
    name: 'catalog', 
    query: { category: id } 
  });
  
  if (selectedParentId.value === id) {
    isOpen.value[id] = !isOpen.value[id];
    if (!isOpen.value[id]) {
      resetCategory();
    }
    return;
  }
  
  closeAllCategories();
  
  selectedParentId.value = id;
  isOpen.value[id] = true;
  emit('select-category', id);
};

const selectChildCategory = (childId, parentId) => {
  router.push({ 
    name: 'catalog', 
    query: { category: childId } 
  });
  
  if (window.innerWidth <= 768) {
    mobileMenuOpen.value = false;
  }
  
  closeAllCategories();
  
  selectedParentId.value = parentId;
  isOpen.value[parentId] = true;
  emit('select-category', childId);
};

const resetCategory = () => {
  router.push({ name: 'catalog' });
  selectedParentId.value = null;
  closeAllCategories();
  emit('reset-category');
};

const getChildren = (parentId) => {
  return props.categories.filter(cat => cat.parent_id === parentId);
};
</script>

  <style scoped>
  h4 {
    color: var(--primary-orange-color);
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
  }
  
  .categories-wrapp {
    padding: 20px;
    background-color: var(--primary-white-color);
    border-radius: 15px;
    min-height: 100vh;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;
    user-select: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border-bottom: 1px solid var(--black-opacity-color);
  }

  .accordion-header.open {
    border-bottom: 1px solid var(--primary-orange-color);
  }

  .accordion-header span {
    font-size: 17px;
    font-weight: 600;
    transition: all 0.3s ease;
    padding-bottom: 5px;
}

.accordion-header span:hover {
    color: var(--primary-orange-color);
}

  .accordion-header span.open {
    color: var(--primary-orange-color);
  }
  
  .arrow-icon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(0deg);
    color: #666;
  }
  
  .arrow-icon.open {
    transform: rotate(180deg);
    color: var(--primary-orange-color);
  }
  
  .categories-item ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 3px solid transparent;
    cursor: pointer;
  }
  

  
  .categories-item li {
    padding: 10px 0 10px 15px;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.2s;
  }
  
  .categories-item li:hover {
    background-color: #f9f9f9;
  }
  
  .categories-item li:last-child {
    border-bottom: none;
  }

  .mobile-category-toggle {
  display: none;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background-color: var(--primary-white-color);
  border-radius: 8px;
  margin-bottom: 10px;
}

.mobile-category-toggle h4 {
  margin: 0;
  color: var(--primary-orange-color);
}

.mobile-arrow {
  transition: transform 0.3s ease;
}

.mobile-arrow.open {
  transform: rotate(180deg);
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .mobile-category-toggle {
    display: flex;
  }
  
  .categories-list {
    display: none;
    background-color: var(--primary-white-color);
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .categories-list.mobile-open {
    display: block;
  }
  
  .categories-wrapp {
    min-height: auto;
    padding: 10px;
  }
  
  .accordion-header {
    padding: 10px 0;
  }
  
  .categories-item li {
    padding: 8px 0 8px 10px;
  }
}
  </style>