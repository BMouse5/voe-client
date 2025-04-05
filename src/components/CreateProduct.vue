<template>
  <div class="add-product">
    <h1>Добавить товар</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Название:</label>
        <input type="text" id="name" v-model="name" required />
      </div>

      <div>
        <label for="description">Описание:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>

      <div>
        <label for="category_id">Категория:</label>
        <select id="category_id" v-model="category_id" required>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="image">Изображение:</label>
        <input type="file" id="image" @change="handleImageUpload" />
      </div>

      <button type="submit">Добавить товар</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      description: '',
      category_id: null,
      image: null,
      categories: []  // Массив для категорий
    };
  },
  mounted() {
    this.fetchCategories();  // Загружаем категории при монтировании компонента
  },
  methods: {
    // Загружаем список категорий с API
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        this.categories = response.data;  // Заполняем массив категорий
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        alert('Ошибка при получении категорий');
      }
    },
    
    handleImageUpload(event) {
      this.image = event.target.files[0]; // Получаем файл изображения
    },

    async handleSubmit() {
      if (!this.image) {
        alert('Пожалуйста, выберите изображение');
        return;
      }

      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('description', this.description);
      formData.append('category_id', this.category_id);
      formData.append('image', this.image);

      try {
        await axios.post('http://localhost:3000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Указываем тип контента для файлов
          }
        });
        alert('Товар успешно добавлен!');
        this.resetForm();
      } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
        alert('Ошибка при добавлении товара');
      }
    },

    resetForm() {
      this.name = '';
      this.description = '';
      this.category_id = null;
      this.image = null;
    }
  }
};
</script>

<style scoped>
.add-product {
  padding: 20px;
}

.add-product form {
  display: flex;
  flex-direction: column;
}

.add-product form div {
  margin-bottom: 10px;
}

.add-product label {
  font-weight: bold;
}

.add-product input,
.add-product textarea,
.add-product select {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
}

.add-product button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.add-product button:hover {
  background-color: #218838;
}
</style>
