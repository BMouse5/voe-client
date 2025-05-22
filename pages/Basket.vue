<template>
  <div class="cart-page">
    <NavBar />
    <div class="container">
        <div class="basket-wrapp">
      <h1>Ваша корзина</h1>
      
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>Ваша корзина пуста</p>
        <router-link to="/catalog" class="continue-shopping">
          Перейти к каталог
        </router-link>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img :src="getImage(item.image_url)" :alt="item.name" class="item-image">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
            </div>
            <div class="item-actions">
              <button @click="removeItem(item.id)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
        
        <div class="cart-summary">
          <h3>Итого</h3>
          <div class="summary-row">
            <span>Товары ({{ cartStore.totalItems }})</span>
          </div>
          <div class="summary-actions">
            <ButtonComp @click="scrollToConsultation">Оформить заказ</ButtonComp>
            <ButtonComp variant="transparent"><router-link to="/catalog" class="continue-shopping">
            Перейти к каталог
            </router-link></ButtonComp>
          </div>
        </div>
      </div>
    </div>
    <ConsultationRequest ref="consultationRef" :is-from-cart="true">Оставьте заявку, чтобы обсудить дальнейшие детали</ConsultationRequest>
    </div>
    <FooterComp />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../src/store/cartStore';
import NavBar from '../src/components/NavBar.vue';
import FooterComp from '../src/components/FooterComp.vue';
import ButtonComp from '../src/components/UI/ButtonComp.vue';
import ConsultationRequest from '../src/components/ConsultationRequest.vue';
const cartStore = useCartStore();
const consultationRef = ref(null)

const getImage = (imageUrl) => {
  return `http://localhost:3000${imageUrl}`;
};

const removeItem = (productId) => {
  cartStore.removeFromCart(productId);
};

const scrollToConsultation = () => {
  if (consultationRef.value?.$el) {
    consultationRef.value.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}

.empty-cart {
  text-align: center;
  padding: 50px;
}

.consultation {
    background: transparent;
    padding: 0;
    padding-bottom: 20px;
}

.consultation-title {
    font-size: 18px;
}

.basket-wrapp {
    min-height: 100vh;
    padding-top: 20px;
}

a {
    color: var(--primary-black-color);
}

.summary-actions button {
    width: 100%;
}

.summary-actions button:hover a {
  color: white !important;
}

.cart-content {
  display: flex;
  gap: 30px;
}

.cart-items {
  flex: 2;
}

.cart-summary {
  flex: 1;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.item-details {
  flex: 1;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.remove-btn {
  margin-left: 10px;
  color: #ff4444;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: var(--primary-orange);
  color: var(--primary-black-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

@media (max-width: 768px) {
  .cart-content {
    flex-direction: column;
  }
}
</style>