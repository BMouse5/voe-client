<template>
    <div class="category-manager">
      <h2>Управление категориями</h2>
      
      <button @click="openCreateModal" class="create-btn">Создать категорию</button>
      
      <div v-if="loading" class="loading">Загрузка категорий...</div>
      
      <table v-else class="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Родительская категория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>{{ getParentName(category.parent_id) }}</td>
            <td class="actions">
              <button @click="openEditModal(category)" class="edit-btn">✏️</button>
              <button @click="confirmDelete(category)" class="delete-btn">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Модальное окно редактирования/создания -->
      <div v-if="showEditModal" class="modal-overlay">
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
                  :disabled="isCurrentOrChild(cat.id)"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div class="modal-actions">
              <button type="submit" :disabled="processing" class="confirm-btn">
                {{ processing ? 'Сохранение...' : 'Сохранить' }}
              </button>
              <button type="button" @click="closeModal" class="cancel-btn">Отмена</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Модальное окно удаления -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal">
          <h3>Подтверждение удаления</h3>
          <p>Вы уверены, что хотите удалить категорию "{{ selectedCategory?.name }}"?</p>
          <p v-if="hasChildCategories" class="warning">Внимание: Будут также удалены все подкатегории!</p>
          <p v-if="hasProducts" class="error">Невозможно удалить: В категории или её подкатегориях есть товары!</p>
          
          <div class="modal-actions">
            <button 
              v-if="!hasProducts"
              @click="deleteCategory" 
              class="confirm-btn"
              :disabled="processing"
            >
              Удалить
            </button>
            <button @click="closeDeleteModal" class="cancel-btn">Отмена</button>
          </div>
        </div>
      </div>
  
      <!-- Уведомление -->
      <div v-if="notification.show" :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CategoryManager',
    data() {
      return {
        categories: [],
        loading: true,
        showEditModal: false,
        showDeleteModal: false,
        editingCategory: null,
        selectedCategory: null,
        form: {
          name: '',
          description: '',
          parent_id: null
        },
        childCategories: [],
        productCount: 0,
        processing: false,
        notification: {
          show: false,
          message: '',
          type: 'success'
        }
      };
    },
    computed: {
      availableParentCategories() {
        return this.categories.filter(cat => 
          !this.editingCategory || 
          (cat.id !== this.editingCategory.id && cat.parent_id !== this.editingCategory.id)
        );
      },
      hasChildCategories() {
        return this.childCategories.length > 0;
      },
      hasProducts() {
        return this.productCount > 0;
      }
    },
    created() {
      this.fetchCategories();
    },
    methods: {
      async fetchCategories() {
        try {
          const response = await axios.get('http://localhost:3000/api/categories');
          this.categories = response.data;
        } catch (error) {
          this.showNotification('Ошибка при загрузке категорий', 'error');
        } finally {
          this.loading = false;
        }
      },
      
      getParentName(parentId) {
        if (!parentId) return '-';
        const parent = this.categories.find(c => c.id === parentId);
        return parent ? parent.name : 'Неизвестно';
      },
      
      openCreateModal() {
        this.editingCategory = null;
        this.form = {
          name: '',
          description: '',
          parent_id: null
        };
        this.showEditModal = true;
      },
      
      openEditModal(category) {
        this.editingCategory = category;
        this.form = {
          name: category.name,
          description: category.description,
          parent_id: category.parent_id
        };
        this.showEditModal = true;
      },
      
      isCurrentOrChild(categoryId) {
        if (!this.editingCategory) return false;
        
        const checkChildren = (parentId) => {
          const children = this.categories.filter(c => c.parent_id === parentId);
          return children.some(c => c.id === categoryId || checkChildren(c.id));
        };
        
        return categoryId === this.editingCategory.id || checkChildren(this.editingCategory.id);
      },
      
      async handleSubmit() {
        this.processing = true;
        try {
          if (this.editingCategory) {
            // Редактирование существующей категории
            const response = await axios.put(
              `http://localhost:3000/api/categories/${this.editingCategory.id}`,
              this.form
            );
            this.showNotification('Категория успешно обновлена', 'success');
            this.updateCategoryInList(response.data);
          } else {
            // Создание новой категории
            const response = await axios.post(
              'http://localhost:3000/api/categories',
              this.form
            );
            this.showNotification('Категория успешно создана', 'success');
            this.categories.push(response.data);
          }
          this.closeModal();
        } catch (error) {
          this.showNotification(
            error.response?.data?.error || 'Ошибка при сохранении категории', 
            'error'
          );
        } finally {
          this.processing = false;
        }
      },
      
      updateCategoryInList(updatedCategory) {
        const index = this.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
          this.categories.splice(index, 1, updatedCategory);
        }
      },
      
      confirmDelete(category) {
        this.selectedCategory = category;
        this.checkCategoryDependencies(category.id);
        this.showDeleteModal = true;
      },
      
      async checkCategoryDependencies(categoryId) {
        try {
          const [childrenResponse, productsResponse] = await Promise.all([
            axios.get(`http://localhost:3000/api/categories/children/${categoryId}`),
            axios.get(`http://localhost:3000/api/categories/${categoryId}/products`)
          ]);
          this.childCategories = childrenResponse.data;
          this.productCount = productsResponse.data.count;
        } catch (error) {
          this.showNotification('Ошибка при проверке зависимостей', 'error');
        }
      },
      
      async deleteCategory() {
        this.processing = true;
        try {
          await axios.delete(`http://localhost:3000/api/categories/${this.selectedCategory.id}`);
          this.showNotification('Категория успешно удалена', 'success');
          this.categories = this.categories.filter(
            c => c.id !== this.selectedCategory.id && c.parent_id !== this.selectedCategory.id
          );
          this.closeDeleteModal();
        } catch (error) {
          this.showNotification(
            error.response?.data?.error || 'Ошибка при удалении категории', 
            'error'
          );
        } finally {
          this.processing = false;
        }
      },
      
      closeModal() {
        this.showEditModal = false;
        this.editingCategory = null;
      },
      
      closeDeleteModal() {
        this.showDeleteModal = false;
        this.selectedCategory = null;
        this.childCategories = [];
        this.productCount = 0;
      },
      
      showNotification(message, type) {
        this.notification = {
          show: true,
          message,
          type
        };
        setTimeout(() => {
          this.notification.show = false;
        }, 3000);
      }
    }
  };
  </script>
  
  <style scoped>
  .category-manager {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .create-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  
  .loading {
    padding: 20px;
    text-align: center;
    font-style: italic;
    color: #666;
  }
  
  .categories-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .categories-table th, 
  .categories-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .categories-table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  .actions {
    display: flex;
    gap: 5px;
  }
  
  .edit-btn, .delete-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .edit-btn {
    background-color: #2196F3;
    color: white;
  }
  
  .delete-btn {
    background-color: #ff4d4f;
    color: white;
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
    padding: 24px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }
  
  .modal h3 {
    margin-top: 0;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-group textarea {
    min-height: 100px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .confirm-btn {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .cancel-btn {
    background-color: #f0f0f0;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .warning {
    color: #faad14;
    font-weight: bold;
  }
  
  .error {
    color: #ff4d4f;
    font-weight: bold;
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    animation: slideIn 0.3s ease-out;
  }
  
  .notification.success {
    background-color: #52c41a;
  }
  
  .notification.error {
    background-color: #ff4d4f;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  </style>