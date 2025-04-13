<template>
    <div class="products-wrapp">
        <h4 @click="$emit('reset-category')">
      {{ selectedCategory ? 'Товары категории' : 'Все товары' }}
    </h4>
      <div class="product-list">
        <div class="card" v-for="product in products" :key="product.id">
          <div class="card-body">
            <img 
              v-if="product.image_url" 
              :src="getImage(product.image_url)" 
              :alt="product.name"
              class="product-image"
            >
            <div class="card-buy">
              <img src="/src/assets/img/cart.svg" alt="Купить" class="cart-icon">
              <span class="buy-text">Купить</span>
            </div>
          </div>
          <h5>{{ product.name }}</h5>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const props = defineProps({
    products: {
      type: Array,
      default: () => []
    },
    selectedCategory: {
      type: [Number, String],
      default: null
    }
  })
  
  const getImage = (imageUrl) => {
    return `http://localhost:3000${imageUrl}`
  }
  </script>
  
  <style scoped>
/* Основные стили контейнера */
.products-wrapp {
  background-color: var(--primary-white-color);
  padding: 15px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

h4 {
  color: var(--primary-orange-color);
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

h4:hover {
  color: var(--primary-orange-dark);
}

/* Сетка товаров */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  justify-items: center;
}

/* Стили карточки товара */
.card {
  width: 100%;
  max-width: 193px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.card-body {
  background-color: var(--primary-dark-gray);
  border-radius: 12px;
  position: relative;
  box-shadow: 0 2px 12px 0 var(--black-opacity-color);
  width: 100%;
  height: 140px;
}

/* Изображение товара */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s;
}

.card:hover .product-image {
  transform: scale(1.03);
}

/* Кнопка "Купить" */
.card-buy {
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background-color: var(--primary-black-color);
  top: 65%;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 0;
}

.cart-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.buy-text {
  color: white;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  width: 0;
  transition: all 0.3s ease;
  margin-left: 0;
}

/* Анимация при наведении */
.card:hover .card-buy {
  width: 75px;
  padding: 0 8px;
  justify-content: flex-start;
}

.card:hover .cart-icon {
  margin-right: 5px;
}

.card:hover .buy-text {
  opacity: 1;
  width: auto;
  margin-left: 5px;
}

/* Название товара */
h5 {
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  margin: 0;
  padding: 0 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 36px;
}

/* Адаптивность */
@media (min-width: 400px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .card-body {
    height: 150px;
  }
  
  .card-buy {
    top: 65%;
  }
  
  h5 {
    font-size: 14px;
  }
}

@media (min-width: 576px) {
  .products-wrapp {
    padding: 20px;
  }
  
  h4 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 18px;
  }
  
  .card-body {
    height: 160px;
    border-radius: 15px;
  }
  
  .card-buy {
    width: 24px;
    height: 24px;
    right: -10px;
  }
  
  .cart-icon {
    width: 16px;
    height: 16px;
  }
  
  .buy-text {
    font-size: 12px;
  }
  
  .card:hover .card-buy {
    width: 85px;
  }
}

@media (min-width: 768px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
  
  .card-body {
    height: 180px;
  }
  
  h5 {
    font-size: 15px;
    min-height: 40px;
  }
}

@media (min-width: 992px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(193px, 1fr));
  }
  
  .card-body {
    height: 193px;
  }
  
  .card-buy {
    right: -11px;
    top: 70%;
  }
  
  .card:hover .card-buy {
    width: 90px;
  }
}
  </style>