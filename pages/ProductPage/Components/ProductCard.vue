<template>
    <div class="product-page">
        <div v-if="loading" class="loading">Загрузка товара...</div>
        <div v-else-if="product" class="product-container">
            <!-- Уведомление о добавлении в корзину -->
            <div v-if="showNotification" class="notification">
                Товар добавлен в корзину!
            </div>
            
            <!-- Блок с фото товара -->
            <div class="product-gallery">
                <div class="main-image">
                    <img :src="getImage(product.image_url)" :alt="product.name" class="product-image">
                </div>
            </div>
            
            <!-- Блок с информацией о товаре -->
            <div class="product-info">
                <h1 class="product-title">{{ product.name }}</h1>
                
                <div class="price-block" v-if="product.price">
                    <span class="current-price">{{ product.price }} ₽</span>
                    <span class="old-price" v-if="product.old_price">{{ product.old_price }} ₽</span>
                </div>
                
                <div class="description-block">
                    <h3>Описание</h3>
                    <p class="product-description">{{ product.description }}</p>
                </div>
                
                <div class="action-buttons">
                    <ButtonComp @click="handleConsultationClick">Заказать</ButtonComp>
                    <ButtonComp 
                        variant="transparent" 
                        @click="toggleCart"
                        :class="{ 'in-cart': isInCart }"
                    >
                        {{ isInCart ? 'Удалить из корзины' : 'В корзину' }}
                    </ButtonComp>
                </div>
            </div>
        </div>
        <div v-else class="not-found">
            <h2>Товар не найден</h2>
            <p>К сожалению, запрашиваемый товар отсутствует в нашем магазине.</p>
            <router-link to="/catalog" class="back-link">&lt;</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProductById } from '../../../src/services/api.service'
import { useCartStore } from '../../../src/store/cartStore';
import ButtonComp from '../../../src/components/UI/ButtonComp.vue'

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const cartStore = useCartStore();
const showNotification = ref(false);
const emit = defineEmits(['scroll-to-consultation']);

// Проверяем, есть ли товар в корзине
const isInCart = computed(() => {
    return product.value ? cartStore.items.some(item => item.id === product.value.id) : false;
});

const handleConsultationClick = () => {
    emit('scroll-to-consultation');
};

const getImage = (imageUrl) => {
    return `http://62.113.41.108${imageUrl}`;
};

const fetchProduct = async () => {
    try {
        loading.value = true;
        product.value = await fetchProductById(route.params.id);
    } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
        product.value = null;
    } finally {
        loading.value = false;
    }
};

const toggleCart = () => {
    if (!product.value) return;
    
    if (isInCart.value) {
        cartStore.removeFromCart(product.value.id);
    } else {
        cartStore.addToCart(product.value);
        showNotification.value = true;
        setTimeout(() => {
            showNotification.value = false;
        }, 3000);
    }
};

onMounted(() => {
    fetchProduct();
});
</script>

<style scoped>
.product-page {
    margin: 0 auto;
    padding: 30px 0;
    min-height: 70vh;
}

.loading {
    text-align: center;
    padding: 50px;
    font-size: 18px;
    color: #666;
}

.not-found {
    text-align: center;
    padding: 50px;
}
.not-found h2 {
    color: var(--primary-orange);
    margin-bottom: 15px;
}
.not-found p {
    margin-bottom: 20px;
}
.back-link {
    color: var(--primary-blue);
    text-decoration: none;
    font-weight: 500;
}
.back-link:hover {
    text-decoration: underline;
}

.product-container {
    display: flex;
    gap: 40px;
}

.product-gallery {
    flex: 1;
    max-width: 50%;
}

.main-image {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    background: #f9f9f9;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
}
.product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.product-info {
    flex: 1;
    max-width: 50%;
    display: flex;
    flex-direction: column;
}

.product-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
}

.price-block {
    margin: 25px 0;
    display: flex;
    align-items: center;
    gap: 15px;
}
.current-price {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary-orange);
}
.old-price {
    font-size: 22px;
    color: #999;
    text-decoration: line-through;
}

.description-block {
    margin: 25px 0;
    padding: 20px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}
.description-block h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #444;
}
.product-description {
    line-height: 1.6;
    color: #555;
}

.action-buttons {
    display: flex;
    gap: 15px;
    margin: 30px 0;
}

.action-buttons button:nth-child(2) {
    color: #333;
}

.action-buttons button:nth-child(2):hover {
    color: #ffffff;
}

.buy-button {
    flex: 1;
    padding: 15px;
    font-size: 16px;
    background: #fff;
    border: 1px solid var(--primary-orange);
    color: var(--primary-orange);
}
.buy-now-button {
    flex: 1;
    padding: 15px;
    font-size: 16px;
    background: var(--primary-orange);
    color: #fff;
}

.additional-info {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid #eee;
}
.info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    color: #666;
}
.info-item img {
    width: 20px;
    height: 20px;
}

/* Адаптивность */
@media (max-width: 992px) {
    .product-container {
        flex-direction: column;
        gap: 30px;
    }
    .product-gallery,
    .product-info {
        max-width: 100%;
    }
    .main-image {
        height: 350px;
    }
}

@media (max-width: 576px) {
    .product-title {
        font-size: 24px;
    }
    .current-price {
        font-size: 28px;
    }
    .action-buttons {
        flex-direction: column;
    }
    .main-image {
        height: 300px;
        padding: 15px;
    }
}


.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--primary-orange-color);
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: fadeInOut 3s ease-in-out;
    z-index: 10000;
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
}

</style>