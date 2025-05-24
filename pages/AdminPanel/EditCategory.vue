<template>
    <div class="edit-category">
      <h2>{{ categoryId ? 'Редактирование категории' : 'Создание категории' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="category-form" enctype="multipart/form-data">
        <div class="form-group">
          <label for="name">Название</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="description">Описание</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="parent">Родительская категория</label>
          <select
            id="parent"
            v-model="form.parent_id"
          >
            <option :value="null">Без родительской категории</option>
            <option 
              v-for="category in availableParentCategories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="image">Изображение</label>
          <input
            type="file"
            id="image"
            @change="handleImageUpload"
            accept="image/*"
          />
          <div v-if="currentImage || imagePreview" class="image-preview">
            <img :src="currentImage || imagePreview" alt="Preview" />
            <button v-if="currentImage" type="button" @click="removeCurrentImage" class="remove-btn">
              Удалить текущее изображение
            </button>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <router-link to="/admin/categories" class="cancel-btn">
            Отмена
          </router-link>
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { fetchCategoryById, fetchCategories, updateCategory, createCategory } from '../../src/services/api.service';
  
  const route = useRoute();
  const router = useRouter();
  
  const categoryId = route.params.id;
  const loading = ref(false);
  const error = ref('');
  const imagePreview = ref('');
  const currentImage = ref('');
  const categories = ref([]);
  
  const form = ref({
    name: '',
    description: '',
    parent_id: null,
    image: null
  });
  
  const availableParentCategories = computed(() => {
  // Выбираем только категории верхнего уровня (без родительской категории)
  const topLevelCategories = categories.value.filter(category => category.parent_id === null);

  // Исключаем текущую категорию, если редактируем
  return topLevelCategories.filter(cat => !categoryId || cat.id !== parseInt(categoryId));
});

  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://voenerdgy.ru${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };
  
  onMounted(async () => {
    try {
      categories.value = await fetchCategories();
      
      if (categoryId) {
        const category = await fetchCategoryById(categoryId);
        form.value = {
          name: category.name,
          description: category.description,
          parent_id: category.parent_id,
          image: null
        };
        
        if (category.image_url) {
          currentImage.value = getImageUrl(category.image_url);
        }
      }
    } catch (err) {
      error.value = 'Не удалось загрузить данные категории';
      console.error(err);
    }
  });
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      form.value.image = file;
      currentImage.value = '';
      
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeCurrentImage = () => {
    currentImage.value = '';
    form.value.image = null;
    form.value.shouldRemoveImage = true;
  };
  
  const handleSubmit = async () => {
    loading.value = true;
    error.value = '';
    
    try {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('description', form.value.description);
      
      if (form.value.parent_id !== null) {
        formData.append('parent_id', form.value.parent_id);
      }
      
      if (form.value.image) {
        formData.append('image', form.value.image);
      } else if (form.value.shouldRemoveImage) {
        formData.append('remove_image', 'true');
      }
      
      if (categoryId) {
        await updateCategory(categoryId, formData);
      } else {
        await createCategory(formData);
      }
      
      router.push('/admin/categories');
    } catch (err) {
      error.value = err.message || 'Ошибка при сохранении категории';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .edit-category {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .category-form {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 1.5rem;
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
    resize: vertical;
  }
  
  .image-preview {
    margin-top: 1rem;
  }
  
  .image-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
  }
  
  .remove-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .form-actions button {
    background-color: var(--primary-orange-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .form-actions button:hover {
    background-color: var(--primary-dark-orange);
  }
  
  .form-actions button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .cancel-btn {
    background-color: #f5f5f5;
    color: #333;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  .cancel-btn:hover {
    background-color: #e0e0e0;
  }
  
  .error-message {
    color: #f44336;
    margin-top: 1rem;
  }
  </style>