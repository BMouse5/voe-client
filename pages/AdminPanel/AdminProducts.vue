<template>
    <div class="admin-products">
      <div class="header">
        <h2>Администрирование товаров</h2>
        <router-link to="/admin/products/new" class="add-btn">
          Добавить товар
        </router-link>
      </div>
      
      <div v-if="loading" class="loading">Загрузка...</div>
      
      <table v-else class="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Фото</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ getCategoryName(product.category_id) }}</td>
            <td>
            <img 
              v-if="product.fullImageUrl" 
              :src="product.fullImageUrl" 
              :alt="product.name"
              style="max-width: 100px; max-height: 100px;"
            >
            <span v-else>Нет фото</span>
           </td>
            <td class="actions">
              <router-link 
                :to="`/admin/products/edit/${product.id}`" 
                class="edit-btn"
              >
                Редактировать
              </router-link>
              <button 
                @click="confirmDelete(product.id)" 
                class="delete-btn"
                :disabled="deleteLoading[product.id]"
              >
                {{ deleteLoading[product.id] ? 'Удаление...' : 'Удалить' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { fetchProducts, fetchCategories, deleteProduct } from '../../src/services/api.service';
  
  const products = ref([]);
  const categories = ref([]);
  const loading = ref(true);
  const deleteLoading = ref({}); // Для отслеживания состояния удаления каждого товара
  const errorMessage = ref('');
  
  const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};


onMounted(async () => {
  try {
    const [productsData, categoriesData] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);
    
    // Добавляем полный URL изображения для каждого продукта
    products.value = productsData.map(product => ({
      ...product,
      fullImageUrl: getImageUrl(product.image_url)
    }));
    
    categories.value = categoriesData;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    errorMessage.value = 'Не удалось загрузить список товаров';
  } finally {
    loading.value = false;
  }
});
  
  const getCategoryName = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId);
    return category ? category.name : 'Неизвестно';
  };
  
  const confirmDelete = (productId) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProductHandler(productId);
    }
  };
  
  const deleteProductHandler = async (productId) => {
    try {
      deleteLoading.value[productId] = true;
      await deleteProduct(productId);
      products.value = products.value.filter(p => p.id !== productId);
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      errorMessage.value = 'Не удалось удалить товар';
    } finally {
      deleteLoading.value[productId] = false;
    }
  };
  </script>
  
  <style scoped>
  .admin-products {
    padding: 1rem;
    overflow-x: auto; /* Добавляем горизонтальный скролл при необходимости */
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
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .add-btn:hover {
    background-color: #45a049;
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
  
  .products-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    table-layout: fixed; /* Фиксированная ширина ячеек */
  }
  
  .products-table th, 
  .products-table td {
    padding: 0.75rem;
    text-align: left;
    vertical-align: middle; /* Выравнивание по вертикали */
    word-wrap: break-word; /* Перенос длинных слов */
  }
  
  .products-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    position: sticky;
    top: 0;
  }
  
  /* Установим фиксированные ширины для колонок */
  .products-table th:nth-child(1),
  .products-table td:nth-child(1) {
    width: 60px; /* ID */
  }
  
  .products-table th:nth-child(2),
  .products-table td:nth-child(2) {
    width: 200px; /* Название */
  }
  
  .products-table th:nth-child(3),
  .products-table td:nth-child(3) {
    width: 150px; /* Категория */
  }
  
  .products-table th:nth-child(4),
  .products-table td:nth-child(4) {
    width: 120px; /* Фото */
  }
  
  .products-table th:nth-child(5),
  .products-table td:nth-child(5) {
    width: 180px; /* Действия */
  }

  .products-table tr {
    border-bottom: 1px solid #ddd;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .edit-btn {
    background-color: #2196F3;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.875rem;
    transition: opacity 0.3s;
    white-space: nowrap; /* Запрет переноса текста */
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
    white-space: nowrap; /* Запрет переноса текста */
  }
  
  .delete-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .edit-btn:hover, .delete-btn:hover {
    opacity: 0.9;
  }
  
  /* Стили для изображений */
  .products-table img {
    max-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
    display: block;
    margin: 0 auto;
    object-fit: contain; /* Сохраняет пропорции */
  }
  
  /* Адаптивность для мобильных устройств */
  @media (max-width: 768px) {
    .products-table {
      display: block;
    }
    
    .products-table thead {
      display: none;
    }
    
    .products-table tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
    }
    
    .products-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100% !important;
      text-align: right;
      padding-left: 50%;
      position: relative;
      border-bottom: 1px solid #eee;
    }
    
    .products-table td::before {
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