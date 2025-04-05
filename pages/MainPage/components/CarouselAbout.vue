<template>
    <div class="slider-container">
      <div 
        class="slider-wrapper"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
      >
        <div class="slider" :style="sliderStyle" ref="slider">
          <div 
            v-for="(product, index) in products" 
            :key="index" 
            class="product-card"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <div class="product-content">
              <div class="product-image-container">
                <img 
                  :src="product.image" 
                  :alt="product.name" 
                  class="product-image"
                >
              </div>
              <h3 class="product-name">{{ product.name }}</h3>
              <div 
                class="product-overlay"
                :class="{ 'overlay-visible': hoveredIndex === index }"
              >
                <div class="overlay-title">
                  <p class="product-description">{{ product.description }}</p>
                </div>
                <div class="overlay-button">
                  <ButtonComp variant="transparent">Узнать больше</ButtonComp>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ButtonComp from '../../../src/components/UI/ButtonComp.vue';

const products = [
    {
      name: 'Товар 1',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 2',
      image: '../../../src/assets/img/2.png',
            description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 3',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 4',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 5',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 6',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 7',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    },
    {
      name: 'Товар 8',
      image: '../../../src/assets/img/2.png',
      description: 'Насос НБ-50 - буровой, поршневой, горизонтальный, двухцилиндровый, двустороннего действия, приводной со встроенным зубчатым редуктором.'
    }
  ];

const currentSlide = ref(0);
const hoveredIndex = ref(null);
const slidesToShow = ref(4);
const isDragging = ref(false);
const startPos = ref(0);
const currentTranslate = ref(0);
const prevTranslate = ref(0);
const slider = ref(null);
const animationId = ref(null);

const sliderStyle = computed(() => {
  return {
    transform: `translateX(${currentTranslate.value}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease-out'
  };
});

const getPositionX = (event) => {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
};

const startDrag = (event) => {
  isDragging.value = true;
  startPos.value = getPositionX(event);
  cancelAnimationFrame(animationId.value);
  if (slider.value) slider.value.style.cursor = 'grabbing';
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  const currentPosition = getPositionX(event);
  const diff = currentPosition - startPos.value;
  currentTranslate.value = prevTranslate.value + diff;
};

const endDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (slider.value) slider.value.style.cursor = 'grab';
  
  const movedBy = currentTranslate.value - prevTranslate.value;
  
  if (movedBy < -100) {
    // Свайп влево - следующий слайд
    if (currentSlide.value < Math.ceil(products.length / slidesToShow.value) - 1) {
      currentSlide.value++;
    }
  } else if (movedBy > 100) {
    // Свайп вправо - предыдущий слайд
    if (currentSlide.value > 0) {
      currentSlide.value--;
    }
  }
  
  updatePosition();
};

const updatePosition = () => {
  if (!slider.value) return; // Добавляем проверку на существование элемента
  const cardWidth = slider.value.offsetWidth / slidesToShow.value;
  currentTranslate.value = -currentSlide.value * cardWidth;
  prevTranslate.value = currentTranslate.value;
};

const handleResize = () => {
  if (window.innerWidth >= 1920) {
    slidesToShow.value = 4;
  } else if (window.innerWidth >= 1440) {
    slidesToShow.value = 4;
  } else if (window.innerWidth >= 1280) {
    slidesToShow.value = 3;
  } else if (window.innerWidth >= 1024) {
    slidesToShow.value = 3;
  } else if (window.innerWidth >= 768) {
    slidesToShow.value = 2;
  } else {
    slidesToShow.value = 1;
  }
  updatePosition();
};

onMounted(() => {
  // Добавляем небольшую задержку для гарантированной инициализации DOM
  setTimeout(() => {
    handleResize();
    if (slider.value) slider.value.style.cursor = 'grab';
  }, 100);
  
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
  
  <style scoped>
  .slider-container {
    width: 100%;
    max-width: 1920px;
    margin: 90px auto 0;
    padding: 0 20px;
    position: relative;
    user-select: none;
  }
  
  .slider-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
    touch-action: pan-y;
  }
  
  .slider {
    display: flex;
    will-change: transform;
  }
  
  .product-card {
    flex: 0 0 25%;
    margin: 10px 7px;
    box-sizing: border-box;
    transition: transform 0.3s ease;
    box-shadow: 0px 4px 4px 0px #00000040;
    border-radius: 8px;
  }
  
  .product-card:active {
    cursor: grabbing;
  }
  
  .product-content {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .product-image-container {
    width: 100%;
    padding-top: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .product-name {
    padding: 20px 16px;
    font-size: 14px;
    text-align: left;
    font-weight: 200;
    color: var(--primary-orange-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
  
  .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 8px;
    backdrop-filter: blur(7px);
  }
  
  .overlay-visible {
    opacity: 1;
  }
  
  .overlay-button {
    position: absolute;
    bottom: 6%;
    left: 6%;
    right: 0;
  }
  
  .product-description {
    margin-bottom: 15px;
    font-size: 14px;
    text-align: center;
  }
  
  /* Медиа-запросы */
  @media (min-width: 1920px) {
    .product-card {
      flex: 0 0 24.2%;
    }
  }
  
  @media (min-width: 1440px) and (max-width: 1919px) {
    .product-card {
      flex: 0 0 24%;
    }
  }
  
  @media (min-width: 1280px) and (max-width: 1439px) {
    .product-card {
      flex: 0 0 32.033%;
    }
  }
  
  @media (min-width: 1024px) and (max-width: 1279px) {
    .product-card {
      flex: 0 0 32.333%;
    margin: 10px 5px;
    box-shadow: 0px 2px 2px 0px #00000040;
    }
  }
  
  @media (min-width: 768px) and (max-width: 1023px) {
    .product-card {
      flex: 0 0 49%;
      margin: 10px 4px;
      box-shadow: 0px 2px 2px 0px #00000040;
    }
  }
  
  @media (max-width: 767px) {
    .product-card {
      flex: 0 0 100%;
      margin: 0 2px;
      box-shadow: 0px 1px 1px 0px #00000040;
    }
    .product-name {
      white-space: normal;
    }
  }
  </style>