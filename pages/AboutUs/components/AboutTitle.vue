<template>
    <div class="about-title">
      <div class="container text-content">
        <h1>ООО «Виктори Ойл Энерджи»</h1>
        <p>
          Это современная динамично развивающаяся компания, основным видом деятельности которой является производство и продажа запасных частей, оборудования для систем очистки бурового раствора зарубежных фирм Derrick, Swaco, Brand.<br>
          Так же компания освоила производство запасных частей для шламовых насосов MCM, Halco, Derrick, SB, XBSY.<br>
          Основными покупателями нашей продукции являются буровые и сервисные компании России и страны ближнего зарубежья: Белоруссия, Казахстан, Узбекистан.<br>
          Собственный парк оборудования и квалифицированные специалисты дают нам возможность контролировать весь цикл производства от закупа сырья до выпуска готового изделия. Вся продукция проходит обязательную сертификацию.<br>
          Наши менеджеры и сервисный отдел на каждом этапе сделки сопровождают Покупателя, ускоряя процесс изготовления до поставки оборудования на склад заказчика.<br>
          Кроме собственной линейки производимых запасных частей мы можем изготовить изделие под заказ по чертежу или образцу заказчика.<br>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  // Логика компонента, если необходима
  </script>
  
  <style scoped>
  .about-title {
    position: relative;
    min-height: 300px;
    padding: 112px 0;
    color: var(--primary-white-color);
  }
  
  .about-title::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/src/assets/img/about-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    filter: contrast(1) saturate(0) brightness(0.3);
    z-index: -1;
  }
  
  .container {
    position: relative;
  }
  
  .text-content {
    max-width: 952px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 19px;
    padding: 0 20px;
  }
  
  .text-content h1 {
    font-size: 42px;
    line-height: 1.2;
  }
  
  .text-content p {
    font-size: 18px;
    line-height: 1.5;
  }
  
  /* Мобильная адаптация */
  @media (max-width: 768px) {
    .about-title {
      padding: 60px 0;
      min-height: auto;
    }
    
    .text-content {
      gap: 15px;
      text-align: left; /* Изменяем выравнивание для мобильных */
    }
    
    .text-content h1 {
      font-size: 28px;
    }
    
    .text-content p {
      font-size: 16px;
      max-height: 400px; /* Ограничиваем высоту текста */
      overflow-y: auto; /* Добавляем прокрутку при необходимости */
      padding-right: 10px; /* Отступ для скроллбара */
    }
    
    /* Стилизация скроллбара */
    .text-content p::-webkit-scrollbar {
      width: 4px;
    }
    
    .text-content p::-webkit-scrollbar-thumb {
      background-color: rgba(255,255,255,0.3);
      border-radius: 2px;
    }
  }
  
  @media (max-width: 480px) {
    .about-title {
      padding: 40px 0;
    }
    
    .text-content h1 {
      font-size: 24px;
    }
    
    .text-content p {
      font-size: 14px;
    }
  }
  </style>