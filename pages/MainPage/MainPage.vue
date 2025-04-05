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
    z-index: 1000;
}

.carousel-about {
    padding: 87px 0 97px 0;
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
    padding: 35px;
    background-color: var(--primary-dark-orange);
}
</style>