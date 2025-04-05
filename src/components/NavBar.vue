<template>
    <div class="nav">
      <div class="nav-wrapp container">
          <div class="logo-wrapp">
              <img src="../assets/img/logo.png" alt="Voe logo" class="logo-img">
          </div>
          <div class="nav-links">
              <div class="link">
                  <li class="dropdown">
                      <a href="#">Каталог продукции <img src="../assets/img/arrow.png" alt="" class="arrow-img"></a>
                      <ul class="dropdown-menu">
                          <li>Бла</li>
                          <li>Бла</li>
                          <li>Бла</li>
                      </ul>
                  </li>
              </div>
              <div class="link">
                <a href="">О компании</a>
              </div>
              <div class="link">
                <a href="">Контакты</a>
              </div>
          </div>
          <div class="nav-contacts">
            <img src="../assets/img/telephone.png" alt="">
            <div class="contacts-number">
                <span>Свяжитесь с нами</span>
                <span>+7(1234)-56-78-90</span>
                <span>+7(1234)-56-78-90</span>
            </div>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  .nav {
      background-color: var(--primary-black-color);
      height: 114px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2000;
  }
  
  .nav-wrapp {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
  }
  
  .logo-img {
      width: 135px;
      height: 74px;
      cursor: pointer;
  }
  
  .nav-links {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      max-width: 472px;
      width: 100%;
  }
  
  .link {
      list-style: none;
      margin-left: 30px;
  }
  
  .arrow-img {
    margin-left: 8px;
  }

  .dropdown {
      position: relative;
  }
  
  .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #222;
      border: 1px solid #444;
      min-width: 200px;
      padding: 10px 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
  }
  
  .dropdown-menu li {
      padding: 10px 20px;
      text-align: left;
      cursor: pointer;
      color: var(--primary-white-color);
      transition: background-color 0.3s ease;
  }
  
  .dropdown-menu li:hover {
      background-color: #444;
      color: var(--primary-orange-color);
  }
  .dropdown:hover .dropdown-menu {
      display: block;
  }

.nav-contacts {
    display: flex;
    gap: 6px;
}

.nav-contacts img {
    border: 1px solid #FF7F00;
    border-radius: 5px;
    padding: 9px;
    width: 33px;
    height: 33px;
    align-self: flex-end;
    cursor: pointer;
}

.contacts-number {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.contacts-number span {
    color: var(--primary-white-color);
    font-size: 9px;
    font-weight: 400;
    cursor: pointer;
}

.contacts-number span:not(:first-child):hover {
    text-decoration: underline;
}

.contacts-number span:nth-child(2) {
    color: var(--primary-orange-color);
}
.contacts-number span:nth-child(3) {
    color: var(--primary-orange-color);
}
  </style>
  