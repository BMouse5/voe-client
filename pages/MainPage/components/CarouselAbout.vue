<template>
  <div class="slider-container">
    <div 
      class="slider"
      ref="slider"
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
                <ButtonComp variant="transparent">Подробнее</ButtonComp>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComp from '../../../src/components/UI/ButtonComp.vue'
export default {
  name: 'CardSlider',
  data() {
    return {
      position: 0,
      startPos: 0,
      isDragging: false,
      currentIndex: 0,
      hoverIndex: null,
      cards: [
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
  ]
    }
  },
  components: {
    ButtonComp
  },
  computed: {
    cardWidth() {
      return this.$refs.slider ? this.$refs.slider.offsetWidth / this.visibleCards : 0;
    },
    maxPosition() {
      return -((this.cards.length - this.visibleCards) * this.cardWidth);
    },
    visibleCards() {
      if (window.innerWidth >= 1200) return 4;
      if (window.innerWidth >= 768) return 3;
      if (window.innerWidth >= 480) return 2;
      return 1;
    }
  },
  methods: {
    startDrag(e) {
  this.isDragging = true;
  this.startPos = this.getXPos(e);
  this.dragTime = Date.now();
  this.prevPosition = this.position;
  
  // Добавляем для touch-устройств
  if (e.type === 'touchstart') {
    e.preventDefault();
  }
},
    onDrag(e) {
    if (!this.isDragging) return;
    
    const x = this.getXPos(e);
    const dragDistance = (x - this.startPos) * 1.5; // Увеличиваем коэффициент чувствительности
    const newPosition = this.position + dragDistance;
    
    if (newPosition <= 0 && newPosition >= this.maxPosition) {
      this.position = newPosition;
    }
    
    this.startPos = x;
  },
  endDrag() {
  if (!this.isDragging) return;
  this.isDragging = false;
  
  // Рассчитываем скорость свайпа
  const velocity = (this.position - this.prevPosition) / (Date.now() - this.dragTime);
  this.dragTime = Date.now();
  this.prevPosition = this.position;
  
  // Добавляем инерцию
  const inertiaDistance = velocity * 50; // Коэффициент инерции
  const targetPosition = this.position + inertiaDistance;
  
  const cardIndex = Math.round(-targetPosition / this.cardWidth);
  this.slideTo(cardIndex);
},
    getXPos(e) {
      return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    },
    slideTo(index) {
      // Ограничиваем индекс, чтобы не выходить за границы
      index = Math.max(0, Math.min(index, this.cards.length - this.visibleCards));
      
      this.currentIndex = index;
      this.position = -index * this.cardWidth;
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.slideTo(this.currentIndex);
    });
  }
}
</script>

<style scoped>
.card-cont {
  background-color: var(--primary-white-color);
  border-radius: 8px;
  padding: 20px 10px;
  box-shadow: 0px 4px 4px 0px #00000040;
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
  touch-action: pan-y; /* Оптимизация для touch-устройств */
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
  padding-bottom: 66.66%; /* Соотношение 3:2 */
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