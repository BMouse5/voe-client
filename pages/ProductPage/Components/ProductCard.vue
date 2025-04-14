<template>
    <div class="product-page">
        <div v-if="loading" class="loading">Загрузка товара...</div>
        <div v-else-if="product" class="product-container">
            <!-- Блок с фото товара -->
            <div class="product-gallery">
                <div class="main-image">
                    <img :src="getImage(product.image_url)" :alt="product.name" class="product-image">
                </div>
                <!-- Здесь можно добавить миниатюры, если есть дополнительные фото -->
            </div>
            
            <!-- Блок с информацией о товаре -->
            <div class="product-info">
                <h1 class="product-title">{{ product.name }}</h1>
                
                <!-- Блок цены -->
                <div class="price-block" v-if="product.price">
                    <span class="current-price">{{ product.price }} ₽</span>
                    <span class="old-price" v-if="product.old_price">{{ product.old_price }} ₽</span>
                </div>
                
                <!-- Описание товара -->
                <div class="description-block">
                    <h3>Описание</h3>
                    <p class="product-description">{{ product.description }}</p>
                </div>
                
                <!-- Кнопки действий -->
                <div class="action-buttons">
                    <ButtonComp @click="handleConsultationClick">Заказать</ButtonComp>
                </div>
                
                <!-- Дополнительная информация -->
                <div class="additional-info">
                    <div class="info-item">
                        <img src="../../../src/assets/img/position.svg" alt="Доставка">
                        <span>Бесплатная доставка от ###руб.</span>
                    </div>
                    <div class="info-item">
                        <img src="../../../src/assets/img/assoriment.png" alt="Возврат">
                        <span>Возврат в течение ## дней</span>
                    </div>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProductById } from '../../../src/services/api.service'
import ButtonComp from '../../../src/components/UI/ButtonComp.vue'

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const emit = defineEmits(['scroll-to-consultation']);

const handleConsultationClick = () => {
  emit('scroll-to-consultation');
};
const getImage = (imageUrl) => {
    return `http://localhost:3000${imageUrl}`;
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
</style>