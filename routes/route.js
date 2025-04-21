import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import { validateToken } from '../src/services/api.service';
import MainPage from "../pages/MainPage/MainPage.vue";
import AboutUsPage from "../pages/AboutUs/AboutUsPage.vue";
import ContactsPage from "../pages/ContactsPage/ContactsPage.vue";
import CatalogPage from "../pages/CatalogPage/CatalogPage.vue";
import ProductPage from "../pages/ProductPage/ProductPage.vue";


import AdminLogin from "../pages/AdminPanel/AdminLogin.vue";

// Admin routes
import AdminLayout from "../pages/AdminPanel/AdminLayout.vue";
import AdminDashboard from "../pages/AdminPanel/AdminDashboard.vue";
import AdminProducts from "../pages/AdminPanel/AdminProducts.vue";
const routes = [
    {
        path: '/',
        name: MainPage,
        component: MainPage,
        props: true,
        meta: {
          title: 'Victory Oil Energy - Главная',
          description: 'Производство высококачественных аналоговых нефтегазовых деталей'
      }
    },
    {
        path: '/about-us',
        name: AboutUsPage,
        component: AboutUsPage,
        props: true,
        meta: {
          title: 'О компании | Victory Oil Energy',
          description: 'Информация о компании Victory Oil Energy и нашей деятельности'
      }
    },
    {
        path: '/contacts',
        name: ContactsPage,
        component: ContactsPage,
        props: true,
        meta: {
          title: 'Контакты | Victory Oil Energy',
          description: 'Как связаться с Victory Oil Energy - адреса, телефоны, электронная почта'
      }
    },
    {
        path: '/catalog',
        name: 'catalog',
        component: CatalogPage,
        props: (route) => ({ categoryId: route.query.category }),
        meta: {
          title: 'Каталог продукции | Victory Oil Energy',
          description: 'Каталог нефтегазовых компонентов и деталей производства Victory Oil Energy'
      }
    },
    {
        path: '/product/:id',
        name: 'product',
        component: ProductPage,
        props: true
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('../pages/AdminPanel/AdminLogin.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: '/admin',
        component: () => import('../pages/AdminPanel/AdminLayout.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            redirect: '/admin/dashboard'
          },
          {
            path: 'dashboard',
            name: 'AdminDashboard',
            component: () => import('../pages/AdminPanel/AdminDashboard.vue')
          },
          {
            path: 'products',
            name: 'AdminProducts',
            component: () => import('../pages/AdminPanel/AdminProducts.vue')
          },
          {
            path: 'products/new',
            name: 'AdminNewProduct',
            component: () => import('../pages/AdminPanel/EditProduct.vue'),
            props: { isNew: true }
          },
          {
            path: 'products/edit/:id',
            name: 'AdminEditProduct',
            component: () => import('../pages/AdminPanel/EditProduct.vue'),
            props: true
          },
          {
            path: 'categories',
            name: 'AdminCategories',
            component: () => import('../pages/AdminPanel/AdminCategories.vue')
          }
        ]
      }
]

export function createAppRouter() {
  const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });

  // Навесим навигационные защиты
  router.beforeEach(async (to, from, next) => {
    const isAuthenticated = await validateToken();

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/admin/login');
    }

    if (to.meta.requiresGuest && isAuthenticated) {
      return next('/admin');
    }

    next();
  });

  router.afterEach((to, from) => {
    if (typeof window !== 'undefined') {
      if (to.hash) {
        setTimeout(() => {
          const element = document.querySelector(to.hash);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  router.afterEach((to) => {
    if (typeof document !== 'undefined') {
        document.title = to.meta?.title || 'Victory Oil Energy'
        
        // Обновляем meta description
        let metaDescription = document.querySelector('meta[name="description"]')
        if (!metaDescription) {
            metaDescription = document.createElement('meta')
            metaDescription.name = 'description'
            document.head.appendChild(metaDescription)
        }
        metaDescription.content = to.meta?.description || 'Производство аналоговых нефтегазовых деталей'
    }
})
  

  return router;
}
