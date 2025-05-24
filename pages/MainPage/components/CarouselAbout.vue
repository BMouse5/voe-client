<template>
  <div class="slider-container">
    <div 
      class="slider"
      ref="slider"
      v-if="props.products && props.products.length > 0"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="onDrag"
      @touchmove="onDrag"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mouseleave="endDrag"
    >
      <div 
        class="slide-track" 
        :style="{ transform: `translateX(${position}px)` }"
      >
        <div 
          v-for="(card, index) in cards" 
          :key="index" 
          class="card"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = null"
        >
          <div class="card-cont">
            <div class="card-image">
              <img :src="card.image" :alt="card.title">
            </div>
            <div class="card-text">{{ card.name }}</div>
            
            <div 
              class="card-overlay" 
              :class="{ 'active': hoverIndex === index }"
            >
              <div class="overlay-content">
                <div class="overlay-text">{{ card.description }}</div>
                <div class="overlay-button">
                  <ButtonComp variant="transparent" @click="navigateToProduct(card.id)">Подробнее</ButtonComp>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="error-message">К сожалению, на данный момент товары отсутствуют. Попробуйте позже!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ButtonComp from '../../../src/components/UI/ButtonComp.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  categories: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Реактивные переменные для слайдера
const position = ref(0)
const startPos = ref(0)
const isDragging = ref(false)
const currentIndex = ref(0)
const hoverIndex = ref(null)
const slider = ref(null)
const dragTime = ref(0)
const prevPosition = ref(0)

const getImage = (imageUrl) => {
  return `http://voenerdgy.ru${imageUrl}`
}

// Вычисляемые свойства
const cardWidth = computed(() => {
  return slider.value ? slider.value.offsetWidth / visibleCards.value : 0
})

const maxPosition = computed(() => {
  return -((cards.value.length - visibleCards.value) * cardWidth.value)
})

const visibleCards = computed(() => {
  if (window.innerWidth >= 1200) return 4
  if (window.innerWidth >= 768) return 3
  if (window.innerWidth >= 480) return 2
  return 1
})

const cards = computed(() => {
  // Сначала находим ID всех подкатегорий (у которых есть parent_id)
  const subcategoryIds = props.categories
    .filter(category => category.parent_id !== null)
    .map(category => category.id)
  
  // Затем фильтруем продукты, оставляя только те, чья category_id есть в subcategoryIds
  return props.products
    .filter(product => subcategoryIds.includes(product.category_id))
    .map(product => ({
      id: product.id,
      title: product.name,
      name: product.name,
      description: product.description,
      image: getImage(product.image_url)
    }))
})

const navigateToProduct = (productId) => {
  router.push({ 
    name: 'product',
    params: { id: productId }
  });
};


// Методы слайдера
const startDrag = (e) => {
  isDragging.value = true
  startPos.value = getXPos(e)
  dragTime.value = Date.now()
  prevPosition.value = position.value
  
  if (e.type === 'touchstart') {
    e.preventDefault()
  }
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  const x = getXPos(e)
  const dragDistance = (x - startPos.value) * 1.5
  const newPosition = position.value + dragDistance
  
  if (newPosition <= 0 && newPosition >= maxPosition.value) {
    position.value = newPosition
  }
  
  startPos.value = x
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  const velocity = (position.value - prevPosition.value) / (Date.now() - dragTime.value)
  dragTime.value = Date.now()
  prevPosition.value = position.value
  
  const inertiaDistance = velocity * 50
  const targetPosition = position.value + inertiaDistance
  
  const cardIndex = Math.round(-targetPosition / cardWidth.value)
  slideTo(cardIndex)
}

const getXPos = (e) => {
  return e.type.includes('touch') ? e.touches[0].clientX : e.clientX
}

const slideTo = (index) => {
  index = Math.max(0, Math.min(index, cards.value.length - visibleCards.value))
  currentIndex.value = index
  position.value = -index * cardWidth.value
}

const handleResize = () => {
  slideTo(currentIndex.value)
}

// Хуки жизненного цикла
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Стили остаются без изменений */
.card-cont {
  background-color: var(--primary-white-color);
  border-radius: 8px;
  padding: 20px 10px;
  box-shadow: 0px 4px 4px 0px #00000040;
  height: 100%;
}
.slider-container {
  width: 100%;
  overflow: hidden;
  padding: 30px 0;
}

.slider {
  width: 100%;
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}

.slider:active {
  cursor: grabbing;
}

.slide-track {
  display: flex;
  transition: transform 0.3s ease-out;
  will-change: transform;
}

.card {
  position: relative;
  flex: 0 0 auto;
  width: calc(100% / 4);
  padding: 0 10px;
  box-sizing: border-box;
}

@media (max-width: 1199px) {
  .card {
    width: calc(100% / 3);
  }
}

@media (max-width: 767px) {
  .card {
    width: calc(100% / 2);
  }
}

@media (max-width: 479px) {
  .card {
    width: 100%;
  }
}

.card-image {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 0;
  padding-bottom: 66.66%;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-text {
  margin-top: 20px;
  text-align: left;
  margin-bottom: 20px;
  margin-left: 10px;
  font-weight:200;
  font-size: 14px;
  color: var(--primary-orange-color);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(7px);
}

.card-overlay.active {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.7);
}

.overlay-content {
  text-align: center;
  padding: 20px;
  color: white;
}

.overlay-text {
  margin-bottom: 20px;
  opacity: 0.7;
  font-size: 14px;
}

.overlay-button {
  position: absolute;
  bottom: 6%;
  left: 6%;
}
</style>