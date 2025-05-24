<template>
  <div class="slider">
    
    <div v-show="slides.length > 0" class="slider-container">
      <div 
        class="slider-track" 
        :style="trackStyle"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div 
          v-for="(slide, index) in slides" 
          :key="index" 
          class="slide"
        >
          <div class="slide-content">
            <div class="text-content">
              <h2 class="slide-title">{{ slide.title }}</h2>
              <p class="slide-description">{{ slide.description }}</p>
              <ButtonComp @click="navigateToCategory(slide.categoryId)">Узнать больше</ButtonComp>
            </div>
            <div class="image-content">
              <img 
                :src="slide.image"
                :alt="slide.title"
                width="350"
                height="300"
                decoding="async"
                loading="eager"
                fetchpriority="high"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          :class="['indicator', { active: currentIndex === index }]"
          @click="goToSlide(index)"
          :aria-label="'Go to slide ' + (index + 1)"
        ></button>
      </div>
    </div>

    <div v-show="slides.length === 0" class="error-message">
      <p>К сожалению, на данный момент товары отсутствуют. Попробуйте позже!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComp from '../../../src/components/UI/ButtonComp.vue';

const router = useRouter()
// === Props ===
const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
});

// === Preload первого изображения (ускоряем LCP) ===
onMounted(() => {
  if (parentCategories.value.length > 0) {
    const preloadImage = `https://voenerdgy.ru${parentCategories.value[0].image_url}`;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = preloadImage;
    document.head.appendChild(link);
  }
});

// === Обработка продуктов ===
const getImage = (imageUrl) => {
  return `https://voenerdgy.ru${imageUrl}`;
};

const slides = computed(() => {
  return parentCategories.value.map(category => ({
    title: category.name,
    description: category.description || "Описание категории отсутствует", // Описание, если доступно
    image: getImage(category.image_url), // Предполагается, что у категории есть image_url
    categoryId: category.id,
  }));
});

const parentCategories = computed(() => {
  return props.categories.filter(category => !category.parent_id);
});

// Функция для навигации в каталог
const navigateToCategory = (categoryId) => {
  router.push({ 
    name: 'catalog', 
    query: { category: categoryId } 
  });
};

// === Слайдер — текущий индекс и свайпы ===
const currentIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: 'transform 0.5s ease',
}));

const goToSlide = (index) => {
  currentIndex.value = index;
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (touchStartX.value - touchEndX.value > 50) {
    nextSlide(); // Свайп влево
  } else if (touchEndX.value - touchStartX.value > 50) {
    prevSlide(); // Свайп вправо
  }
};

// === Автопрокрутка ===
let interval;

const startInterval = () => {
  interval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopInterval = () => {
  clearInterval(interval);
};

onMounted(() => {
  startInterval();
});

onBeforeUnmount(() => {
  stopInterval();
});
</script>


<style scoped>
/* Стили остаются без изменений */
.slider {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 300px;
  background-color: transparent;
}

.slider-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slider-track {
  display: flex;
  height: 100%;
  width: 100%;
}

.slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.slide-content {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 50px;
  box-sizing: border-box;
  align-items: center;
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 50px;
  max-width: 50%;
}

.image-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 428px;
  width: 100%;
  height: 428px;
  margin: 0 auto;
}

.slide-title {
  font-size: 36px;
  margin-bottom: 39px;
  color: var(--primary-black-color);
}

.slide-description {
  font-size: 16px;
  margin-bottom: 18px;
  color: var(--primary-black-color);
  line-height: 100%;
}

.slide-button {
  padding: 12px 30px;
  background-color: var(--primary-orange-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-start;
}

.slide-button:hover {
  background-color: #45a049;
}

.image-content img {
  max-width: 350px;
  width: 100%;
  height: 300px;
  object-fit: contain;
  display: block;
}

.indicators {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: var(--primary-orange-color);
}

/* Для клавиатурной навигации */
.indicator:focus-visible {
  outline: 2px solid var(--primary-orange-color);
  outline-offset: 2px;
}

.error-message {
  min-height: 423px;
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .slider {
    height: auto;
    padding-bottom: 60px;
  }
  
  .slide-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .text-content, .image-content {
    max-width: 100%;
    padding-right: 0;
  }
  
  .text-content {
    order: 2;
    padding-top: 20px;
  }
  
  .image-content {
    order: 1;
    height: 250px;
  }
  
  .slide-title {
    font-size: 1.8rem;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  
  .slide-description {
    font-size: 1rem;
  }
  
  .indicators {
    bottom: 15px;
  }
}
</style>