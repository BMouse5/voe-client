<template>
  <NavBar></NavBar>
  <section class="carousel">
    <div class="carousel-wrapp container">
        <CarouselComp></CarouselComp>
    </div>
  </section>
  <section class="carousel-about">
    <div class="carousel-about-wrapp container">
        <div class="carousel-about-title">
            <h2>Каталог продукции</h2>
            <span>Широкий ассортимент насосов и запасных деталей</span>
        </div>
        <CarouselAbout></CarouselAbout>
    </div>
  </section>
  <section class="why-we">
    <div class="why-we-wrapp container">
        <h2 class="why-we-title">Почему <span class="why-we-title-2">мы</span></h2>
    </div>
  </section>
</template>

<script setup>
import NavBar from '../../src/components/NavBar.vue'
import CarouselComp from './components/CarouselComp.vue'
import ButtonComp from '../../src/components/UI/ButtonComp.vue'
import CarouselAbout from './components/CarouselAbout.vue'
</script>
<style scoped>
.carousel {
    background-color: var(--primary-light-gray);
    padding: 88px 0 100px 0;
    box-shadow: 0px 4px 4px 0px #00000040;
    position: relative;
    z-index: 999;
}

.carousel-about {
    padding: 87px 10px 97px 10px;
    background-color: var(--primary-dark-gray);
}

.carousel-about-title {
    max-width: 552px;
    width: 100%;
}

.carousel-about-title h2 {
    text-transform: uppercase;
    font-size: 42px;
    border-bottom: var(--primary-orange-color) 1px solid;
    display: inline-block;
}

.carousel-about-title span {
    font-size: 12px;
}

.why-we {
    padding: 35px 10px 35px 10px;
    background-color: var(--primary-dark-orange);
}

.why-we-title {
  display: inline-block;
  font-size: clamp(48px, 8vw, 92px); /* Адаптивный размер шрифта */
  font-weight: bold;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--primary-white-color);
  text-transform: uppercase;
  font-family: 'Montserrat Bold';
  line-height: 1.2; /* Опционально: для лучшего отображения */
}

.why-we-title-2 {
  color: var(--primary-white-color);
  -webkit-text-stroke: 0;
  font-family: 'Montserrat Bold';
}

/* Дополнительные медиа-запросы для тонкой настройки */
@media (max-width: 768px) {
  .why-we-title {
    -webkit-text-stroke-width: 1px; /* Уменьшаем толщину обводки на мобильных */
  }
}

@media (max-width: 480px) {
  .why-we-title {
    font-size: clamp(36px, 10vw, 48px); /* Другие значения для очень маленьких экранов */
  }
}
</style>