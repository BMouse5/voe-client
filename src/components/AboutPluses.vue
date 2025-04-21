<template>
    <div class="about-pluses" :style="
    {
      '--bg-color': props.backgroundColor,
      '--text-color': props.textColor,
    }"
    >
      <div class="about-pluses-wrapp container">
        <div class="pluses-title" v-if="props.showTitle">
          <h2 :style="{'--border-color': props.borderColor}">Почему выбирают нас</h2>
          <span>Многолетний опыт, качество продукции, доверие клиентов помогло стать успешной компанией</span>
        </div>
        <div class="card-container">
          <div class="card">
            <img src="../assets/img/card-1.png" alt="">
            <div class="card-title">До 2 лет</div>
            <div class="card-description">Гарантии на выпускаемую продукцию</div>
          </div>
          <div class="card">
            <img src="../assets/img/card-3.png" alt="">
            <div class="card-title">435834</div>
            <div class="card-description">Выпущенной продукции</div>
          </div>
          <div class="card">
            <img src="../assets/img/card-3.png" alt="">
            <div class="card-title">47</div>
            <div class="card-description">Квалифицированных сотрудников</div>
          </div>
          <div class="card">
            <img src="../assets/img/card-1.png" alt="">
            <div class="card-title">562 кв.м.</div>
            <div class="card-description">Производственных площадей</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'var(--primary-dark-gray)'
  },
  textColor: {
    type: String,
    default: 'var(--primary-dark-color)'
  },
  borderColor: {
    type: String,
    default: "var(--primary-orange-color)"
  },
  showTitle: {
    type: Boolean,
    default: true
  }
})
</script>
  
  <style scoped>
  .about-pluses {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
  
  .about-pluses-wrapp {
    padding: 56px 20px;
  }
  
  .pluses-title {
    display: inline-block;
    margin-bottom: 42px;
  }
  
  .pluses-title h2 {
    text-transform: uppercase;
    font-size: clamp(18px, 4vw, 42px);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  
  .pluses-title span {
    font-size: clamp(10px, 2vw, 12px);
    
  }
  
  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .card {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 1/1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.3);
    transition: all 0.3s ease;
  }
  
  .card-title,
  .card-description {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    font-family: 'Montserrat Bold', sans-serif;
    padding: 15px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }
  
  .card-title {
    font-size: clamp(18px, 3vw, 24px);
    opacity: 1;
  }
  
  .card-description {
    font-size: clamp(14px, 2vw, 18px);
    opacity: 0;
    transform: translateY(20px);
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  }
  
  .card:hover {
    transform: scale(1.05);
    z-index: 2;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  
  .card:hover img {
    filter: brightness(0.2);
    transform: scale(1.1);
  }
  
  .card:hover .card-title {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .card:hover .card-description {
    opacity: 1;
    transform: translateY(0);
    padding: 25px; /* Увеличиваем отступы */
  }
  
  /* Адаптация для мобильных */
  @media (max-width: 768px) {
    .about-pluses-wrapp {
      padding: 40px 15px;
    }
    
    .card-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .card:hover {
      transform: none;
    }
    
    .card:hover .card-description {
      padding: 15px;
    }
  }
  
  @media (max-width: 480px) {
    .card-container {
      grid-template-columns: 1fr;
    }
    
    .card {
      aspect-ratio: 16/9;
    }
  }
  </style>