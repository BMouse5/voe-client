<template>
  <div class="admin-categories">
    <div class="header">
      <h2>Управление категориями</h2>
      <router-link to="/admin/categories/new" class="add-btn">
        Создать категорию
      </router-link>
    </div>

    <div v-if="loading" class="loading">Загрузка категорий...</div>

    <table v-else class="categories-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Изображение</th>
          <th>Название</th>
          <th>Родительская категория</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td class="image-cell">
            <img 
              v-if="category.image_url" 
              :src="getImageUrl(category.image_url)" 
              :alt="category.name"
              class="category-image"
            />
            <span v-else>Нет изображения</span>
          </td>
          <td>{{ category.name }}</td>
          <td>{{ getParentName(category.parent_id) }}</td>
          <td class="actions">
            <router-link 
              :to="`/admin/categories/edit/${category.id}`" 
              class="edit-btn"
            >
              Редактировать
            </router-link>
            <button 
              @click="confirmDelete(category)" 
              class="delete-btn"
              :disabled="deleteLoading[category.id]"
            >
              {{ deleteLoading[category.id] ? 'Удаление...' : 'Удалить' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модальное окно для подтверждения удаления -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Подтверждение удаления</h3>
        <p>{{ deleteMessage }}</p>
        
        <div class="modal-actions">
          <button 
            v-if="canDelete" 
            @click="proceedWithDelete" 
            class="confirm-btn"
          >
            Удалить
          </button>
          <button @click="cancelDelete" class="cancel-btn">
            {{ canDelete ? 'Отмена' : 'Закрыть' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  fetchCategories, 
  deleteCategory, 
  fetchCategoryProductsCount,
  fetchChildCategories
} from '../../src/services/api.service';

const categories = ref([]);
const loading = ref(true);
const deleteLoading = ref({});

// Переменные для модального окна
const showDeleteModal = ref(false);
const deleteMessage = ref('');
const categoryToDelete = ref(null);
const canDelete = ref(false);
const isCategoryDeleted = ref(false); // Флаг для отслеживания удаления

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const getParentName = (parentId) => {
  if (!parentId) return '-';
  const parent = categories.value.find(c => c.id === parentId);
  return parent ? parent.name : 'Неизвестно';
};

const loadCategories = async () => {
  try {
    loading.value = true;
    categories.value = await fetchCategories();
  } catch (err) {
    console.error('Ошибка загрузки категорий:', err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async (category) => {
  // Проверяем, не была ли категория уже удалена
  categoryToDelete.value = category;
  
  // Проверяем, является ли категория родительской
  const subcategories = await fetchChildCategories(category.id);
  const hasSubcategories = subcategories.length > 0;
  
  let hasProducts = false;
  let totalProducts = 0;
  
  try {
    // Проверяем товары в самой категории
    const mainCategoryProducts = await fetchCategoryProductsCount(category.id);
    totalProducts += mainCategoryProducts;
    if (mainCategoryProducts > 0) hasProducts = true;
    
    // Проверяем товары в подкатегориях (если есть)
    if (hasSubcategories) {
      for (const subcat of subcategories) {
        const subcatProducts = await fetchCategoryProductsCount(subcat.id);
        totalProducts += subcatProducts;
        if (subcatProducts > 0) hasProducts = true;
      }
    }
  } catch (err) {
    console.error('Ошибка проверки товаров:', err);
    return;
  }
  
  if (hasProducts) {
    deleteMessage.value = `Эта категория содержит товары (${totalProducts} шт.). Удаление невозможно.`;
    canDelete.value = false;
  } else if (hasSubcategories) {
    deleteMessage.value = `Эта категория содержит подкатегории (${subcategories.length} шт.). Все подкатегории также будут удалены. Продолжить?`;
    canDelete.value = true;
  } else {
    deleteMessage.value = `Вы уверены, что хотите удалить категорию "${category.name}"?`;
    canDelete.value = true;
  }
  
  showDeleteModal.value = true;
};

const proceedWithDelete = async () => {
  if (!canDelete.value || !categoryToDelete.value) {
    showDeleteModal.value = false;
    return;
  }

  try {
    deleteLoading.value[categoryToDelete.value.id] = true;
    await deleteCategory(categoryToDelete.value.id);
    isCategoryDeleted.value = true; // Устанавливаем флаг удаления
    await loadCategories(); // Перезагружаем список категорий
    showDeleteModal.value = false; // Закрываем попап после успешного удаления
  } catch (err) {
    console.error('Ошибка удаления категории:', err);
    deleteMessage.value = 'Не удалось удалить категорию. Так как в ней есть товары';
    canDelete.value = false;
  } finally {
    deleteLoading.value[categoryToDelete.value.id] = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  categoryToDelete.value = null;
  isCategoryDeleted.value = false;
//  loadCategories();
};

onMounted(loadCategories);
</script>

<style scoped>
/* Стили аналогичные стилям из admin-products */
.admin-categories {
  padding: 1rem;
  overflow-x: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-btn {
  background-color: var(--primary-orange-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: var(--primary-dark-orange);
}

.loading {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin: 1rem 0;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}

.categories-table th, 
.categories-table td {
  padding: 0.75rem;
  text-align: left;
  vertical-align: middle;
  word-wrap: break-word;
}

.categories-table td {
  height: 85px;
}

.categories-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  position: sticky;
  top: 0;
}

/* Ширины колонок */
.categories-table th:nth-child(1),
.categories-table td:nth-child(1) {
  width: 60px; /* ID */
}

.categories-table th:nth-child(2),
.categories-table td:nth-child(2) {
  width: 120px; /* Изображение */
}

.categories-table th:nth-child(3),
.categories-table td:nth-child(3) {
  width: 200px; /* Название */
}

.categories-table th:nth-child(4),
.categories-table td:nth-child(4) {
  width: 150px; /* Родительская категория */
}

.categories-table th:nth-child(5),
.categories-table td:nth-child(5) {
  width: 180px; /* Действия */
}

.categories-table tr {
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.edit-btn:hover, .delete-btn:hover {
  opacity: 0.9;
}

.category-image {
  max-width: 100px;
  max-height: 60px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content p {
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #d32f2f;
}

.cancel-btn:hover {
  background-color: #bdbdbd;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .categories-table {
    display: block;
  }
  
  .categories-table thead {
    display: none;
  }
  
  .categories-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }
  
  .categories-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100% !important;
    text-align: right;
    padding-left: 50%;
    position: relative;
    border-bottom: 1px solid #eee;
  }
  
  .categories-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 45%;
    padding-left: 1rem;
    font-weight: bold;
    text-align: left;
  }
  
  .actions {
    justify-content: flex-end;
  }
}
</style>