<template>
  <div class="card-container">
    <div class="card">
        <img src="../../../src/assets/img/card-1.png" alt="">
        <div class="card-title">До 2 лет</div>
        <div class="card-description">Гарантии на выпускаемую продукцию</div>
        <div class="corner-arrow top-left"></div>
        <div class="corner-arrow bottom-right"></div>
    </div>
    <div class="card">
        <img src="../../../src/assets/img/card-3.png" alt="">
        <div class="card-title">435834</div>
        <div class="card-description">Выпущенной продукции</div>
        <div class="corner-arrow top-left"></div>
        <div class="corner-arrow bottom-right"></div>
    </div>
    <div class="card">
        <img src="../../../src/assets/img/card-3.png" alt="">
        <div class="card-title">47</div>
        <div class="card-description">Квалифицированных сотрудников</div>
        <div class="corner-arrow top-left"></div>
        <div class="corner-arrow bottom-right"></div>
    </div>
    <div class="card">
        <img src="../../../src/assets/img/card-1.png" alt="">
        <div class="card-title">562 кв.м.</div>
        <div class="card-description">Производственных площадей</div>
        <div class="corner-arrow top-left"></div>
        <div class="corner-arrow bottom-right"></div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.card {
    flex: 1 1 calc(50% - 4px);
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.card img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(0.3);
}

.corner-arrow {
    position: absolute;
    width: 20px;
    height: 20px;
    background-image: url('../../../src/assets/img/arrow-card.png');
    background-size: contain;
    background-repeat: no-repeat;
    transition: transform 0.3s ease;
    z-index: 10;
}

.top-left {
    top: 10px;
    left: 10px;
    transform: rotate(0deg);
}

.bottom-right {
    bottom: 10px;
    right: 10px;
    transform: rotate(180deg);
}

/* Анимация при наведении */
.card:hover .top-left {
    transform: rotate(180deg);
}

.card:hover .bottom-right {
    transform: rotate(0deg);
}

.card-title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 15px;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: 'Montserrat Bold';
    font-size: clamp(16px, 4vw, 24px);
    transition: opacity 0.2s ease-in-out;
}

.card-description {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 15px;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: 'Montserrat Bold';
    font-size: clamp(16px, 4vw, 24px);
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
}

.card:hover {
    transform: scale(1.1); /* Только масштабирование */
    z-index: 2;
}

.card:hover img {
    filter: brightness(0.3) blur(2px); /* Размытие только для изображения */
}

.card:hover .card-title {
    opacity: 0;
    pointer-events: none;
}

.card:hover .card-description {
    opacity: 1;

}
</style>