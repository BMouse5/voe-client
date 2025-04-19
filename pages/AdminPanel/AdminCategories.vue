<template>
    <div class="admin-categories">
      <div class="header">
        <h2>Управление категориями</h2>
        <button @click="openCreateModal" class="add-btn">
          Создать категорию
        </button>
      </div>
  
      <div v-if="loading" class="loading">Загрузка категорий...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
  
      <table v-else class="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Родительская категория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ getParentName(category.parent_id) }}</td>
            <td class="actions">
              <button @click="openEditModal(category)" class="edit-btn">
                Редактировать
              </button>
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
  
      <!-- Модальное окно создания/редактирования -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>{{ editingCategory ? 'Редактирование категории' : 'Создание категории' }}</h3>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Название:</label>
              <input v-model="form.name" required />
            </div>
            
            <div class="form-group">
              <label>Описание:</label>
              <textarea v-model="form.description"></textarea>
            </div>
            
            <div class="form-group">
              <label>Родительская категория:</label>
              <select v-model="form.parent_id">
                <option :value="null">Без родительской категории</option>
                <option 
                  v-for="cat in availableParentCategories" 
                  :key="cat.id" 
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div class="form-actions">
              <button type="submit" :disabled="processing" class="confirm-btn">
                {{ processing ? 'Сохранение...' : 'Сохранить' }}
              </button>
              <button type="button" @click="closeModal" class="cancel-btn">
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Модальное окно подтверждения удаления -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal">
          <h3>Подтверждение удаления</h3>
          <p>Вы уверены, что хотите удалить категорию "{{ selectedCategory?.name }}"?</p>
          <p v-if="hasChildCategories" class="warning">
            Внимание: Будут также удалены все подкатегории!
          </p>
          
          <div class="form-actions">
            <button @click="handleDeleteCategory" class="confirm-btn" :disabled="processing">
              Удалить
            </button>
            <button @click="closeDeleteModal" class="cancel-btn">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    fetchChildCategories
  } from '../../src/services/api.service';
  
  const categories = ref([]);
  const loading = ref(true);
  const error = ref('');
  const showModal = ref(false);
  const showDeleteModal = ref(false);
  const editingCategory = ref(null);
  const selectedCategory = ref(null);
  const processing = ref(false);
  const deleteLoading = ref({});
  const childCategories = ref([]);
  
  const form = ref({
    name: '',
    description: '',
    parent_id: null
  });
  
  // Доступные родительские категории (исключая текущую и ее подкатегории)
  const availableParentCategories = computed(() => {
    return categories.value.filter(cat => 
      !editingCategory.value || cat.id !== editingCategory.value.id
    );
  });
  
  // Есть ли дочерние категории
  const hasChildCategories = computed(() => {
    return childCategories.value.length > 0;
  });
  
  // Получение имени родительской категории
  const getParentName = (parentId) => {
    if (!parentId) return '-';
    const parent = categories.value.find(c => c.id === parentId);
    return parent ? parent.name : 'Неизвестно';
  };
  
  // Загрузка категорий
  const loadCategories = async () => {
    try {
      loading.value = true;
      categories.value = await fetchCategories();
      error.value = '';
    } catch (err) {
      error.value = 'Не удалось загрузить категории';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  // Открытие модального окна создания
  const openCreateModal = () => {
    editingCategory.value = null;
    form.value = { name: '', description: '', parent_id: null };
    showModal.value = true;
  };
  
  // Открытие модального окна редактирования
  const openEditModal = (category) => {
    editingCategory.value = category;
    form.value = { 
      name: category.name, 
      description: category.description, 
      parent_id: category.parent_id 
    };
    showModal.value = true;
  };
  
  // Закрытие модального окна
  const closeModal = () => {
    showModal.value = false;
    editingCategory.value = null;
  };
  
  // Подтверждение удаления
  const confirmDelete = async (category) => {
    selectedCategory.value = category;
    try {
      childCategories.value = await fetchChildCategories(category.id);
      showDeleteModal.value = true;
    } catch (err) {
      error.value = 'Не удалось проверить подкатегории';
      console.error(err);
    }
  };
  
  // Закрытие модального окна удаления
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    selectedCategory.value = null;
    childCategories.value = [];
  };
  
  // Обработка формы
  const handleSubmit = async () => {
    try {
      processing.value = true;
      
      if (editingCategory.value) {
        // Редактирование
        const updatedCategory = await updateCategory(editingCategory.value.id, form.value);
        const index = categories.value.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
          categories.value.splice(index, 1, updatedCategory);
        }
      } else {
        // Создание
        const newCategory = await createCategory(form.value);
        categories.value.push(newCategory);
      }
      
      closeModal();
    } catch (err) {
      error.value = err.message || 'Ошибка при сохранении категории';
      console.error(err);
    } finally {
      processing.value = false;
    }
  };
  
  // Удаление категории
  const handleDeleteCategory  = async () => {
    try {
      processing.value = true;
      deleteLoading.value[selectedCategory.value.id] = true;
      
      await deleteCategory(selectedCategory.value.id);
      categories.value = categories.value.filter(
        c => c.id !== selectedCategory.value.id && c.parent_id !== selectedCategory.value.id
      );
      
      closeDeleteModal();
    } catch (err) {
      error.value = err.message || 'Ошибка при удалении категории';
      console.error(err);
    } finally {
      processing.value = false;
      deleteLoading.value[selectedCategory.value.id] = false;
    }
  };
  
  // Загрузка данных при монтировании
  onMounted(loadCategories);
  </script>
  
  <style scoped>
  .admin-categories {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .add-btn {
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .add-btn:hover {
    background-color: #45a049;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .error-message {
    color: #f44336;
    text-align: center;
    padding: 1rem;
    background-color: #ffeeee;
    border-radius: 4px;
    margin: 1rem 0;
  }
  
  .categories-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .categories-table th, 
  .categories-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .categories-table th {
    background-color: #f5f5f5;
    font-weight: 600;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .edit-btn {
    background-color: #2196F3;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .delete-btn {
    background-color: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .delete-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  
  .modal {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .modal h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .confirm-btn {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .cancel-btn {
    background-color: #f5f5f5;
    color: #333;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .warning {
    color: #ff9800;
    font-weight: 500;
    margin: 0.5rem 0;
  }
  </style>