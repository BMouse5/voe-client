<template>
  <div class="product-list">
    <h1>Список продуктов</h1>
    <ul>
      <li v-for="product in productsWithCategories" :key="product.id" class="product-item">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          
          <!-- Отображаем категорию товара -->
          <p class="category-info">
            Категория: <strong>{{ product.category_name }}</strong>
          </p>
          
          <div class="product-image">
            <img v-if="product.image_url" :src="getImageUrl(product.image_url)" alt="product image">
            <p v-else>Нет изображения</p>
          </div>
        </div>
        
        <div class="product-actions">
          <button @click="deleteProduct(product.id)" class="delete-btn">Удалить</button>
          <button @click="editProduct(product)" class="edit-btn">Редактировать</button>
        </div>

        <!-- Форма для редактирования -->
        <div v-if="product.id === editingProduct.id" class="edit-form">
          <form @submit.prevent="updateProduct">
            <div class="form-group">
              <label>Название:</label>
              <input type="text" v-model="editingProduct.name" required />
            </div>

            <div class="form-group">
              <label>Описание:</label>
              <textarea v-model="editingProduct.description" required></textarea>
            </div>

            <div class="form-group">
              <label>Категория:</label>
              <select v-model="editingProduct.category_id" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                  <span v-if="category.parent_id"> (подкатегория)</span>
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Изображение:</label>
              <input type="file" @change="handleImageUpload" />
              <small v-if="product.image_url">Текущее изображение: {{ product.image_url }}</small>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">Сохранить</button>
              <button type="button" @click="cancelEdit" class="cancel-btn">Отмена</button>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      categories: [],
      editingProduct: {}
    };
  },
  computed: {
    // Добавляем информацию о категории к каждому продукту
    productsWithCategories() {
      return this.products.map(product => {
        const category = this.categories.find(c => c.id === product.category_id);
        return {
          ...product,
          category_name: category ? category.name : 'Не указана',
          category_parent_name: category && category.parent_id 
            ? this.getParentCategoryName(category.parent_id) 
            : null
        };
      });
    }
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    },

    getImageUrl(imageUrl) {
      return `http://127.0.0.1:3000${imageUrl}`;
    },

    // Получаем название родительской категории
    getParentCategoryName(parentId) {
      const parentCategory = this.categories.find(c => c.id === parentId);
      return parentCategory ? parentCategory.name : null;
    },

    async deleteProduct(productId) {
      if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        try {
          await axios.delete(`http://127.0.0.1:3000/api/products/${productId}`);
          this.products = this.products.filter(product => product.id !== productId);
        } catch (error) {
          console.error('Ошибка при удалении товара:', error);
        }
      }
    },

    editProduct(product) {
      this.editingProduct = { ...product };
    },

    cancelEdit() {
      this.editingProduct = {};
    },

    handleImageUpload(event) {
      this.editingProduct.image = event.target.files[0];
    },

    async updateProduct() {
      const formData = new FormData();
      formData.append('name', this.editingProduct.name);
      formData.append('description', this.editingProduct.description);
      formData.append('category_id', this.editingProduct.category_id);

      if (this.editingProduct.image) {
        formData.append('image', this.editingProduct.image);
      }

      try {
        const response = await axios.put(
          `http://127.0.0.1:3000/api/products/${this.editingProduct.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Обновляем данные продукта
        const updatedProduct = response.data;
        this.products = this.products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        );

        this.editingProduct = {};
        alert('Товар успешно обновлен!');
      } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
        alert('Ошибка при обновлении товара');
      }
    }
  }
};
</script>

<style scoped>
.product-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-list ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-info {
  flex-grow: 1;
}

.category-info {
  color: #666;
  font-size: 0.9em;
  margin: 10px 0;
}

.product-image img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.product-actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
}

.edit-btn {
  background-color: #1890ff;
  color: white;
}

.save-btn {
  background-color: #52c41a;
  color: white;
}

.cancel-btn {
  background-color: #f0f0f0;
}

.edit-form {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
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
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>