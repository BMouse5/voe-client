<template>
  <div class="edit-product">
    <h2>{{ productId ? 'Редактирование товара' : 'Добавление товара' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="product-form" enctype="multipart/form-data">
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
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="category">Категория</label>
          <select
          id="category"
          v-model="form.category_id"
          required
        >
          <option value="">Выберите категорию</option>
          <option 
            v-for="category in subcategories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="image">Фото</label>
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
        <router-link to="/admin/products" class="cancel-btn">
          Отмена
        </router-link>
      </div>
      
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProductById, fetchCategories, updateProduct, createProduct } from '../../src/services/api.service';

const route = useRoute();
const router = useRouter();

const productId = route.params.id;
const loading = ref(false);
const error = ref('');
const imagePreview = ref('');
const currentImage = ref('');
const categories = ref([]);

const form = ref({
  name: '',
  description: '',
  category_id: '',
  image: null
});

// Функция для получения корректного URL изображения
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // Если путь уже содержит http (полный URL), возвращаем как есть
  if (imagePath.startsWith('http')) return imagePath;
  // Иначе формируем полный URL
  return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

onMounted(async () => {
  try {
    categories.value = await fetchCategories();
    
    if (productId) {
      const product = await fetchProductById(productId);
      form.value = {
        name: product.name,
        description: product.description,
        category_id: product.category_id,
        image: null
      };
      
      if (product.image_url) {
        // Используем функцию getImageUrl для формирования корректного пути
        currentImage.value = getImageUrl(product.image_url);
      }
    }
  } catch (err) {
    error.value = 'Не удалось загрузить данные товара';
    console.error(err);
  }
});

// Остальные методы остаются без изменений
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
    formData.append('category_id', form.value.category_id);
    
    if (form.value.image) {
      formData.append('image', form.value.image);
    }
    
    if (productId) {
      await updateProduct(productId, formData);
    } else {
      await createProduct(formData);
    }
    
    router.push('/admin/products');
  } catch (err) {
    error.value = err.message || 'Ошибка при сохранении товара';
  } finally {
    loading.value = false;
  }
};

const subcategories = computed(() => {
  // Фильтруем категории, оставляя только те, у которых parent_id не равен null
  return categories.value.filter(category => category.parent_id !== null);
});
</script>

<style scoped>
.edit-product {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.product-form {
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

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
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
</style>