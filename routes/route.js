import { createRouter, createWebHistory } from "vue-router";
//import { validateToken } from '../src/services/api.service';
import MainPage from "../pages/MainPage/MainPage.vue";
import AboutUsPage from "../pages/AboutUs/AboutUsPage.vue";
import ContactsPage from "../pages/ContactsPage/ContactsPage.vue";
import CatalogPage from "../pages/CatalogPage/CatalogPage.vue";
import ProductPage from "../pages/ProductPage/ProductPage.vue";

const routes = [
    {
        path: '/',
        name: MainPage,
        component: MainPage,
        props: true
    },
    {
        path: '/about-us',
        name: AboutUsPage,
        component: AboutUsPage,
        props: true
    },
    {
        path: '/contacts',
        name: ContactsPage,
        component: ContactsPage,
        props: true
    },
    {
        path: '/catalog',
        name: 'catalog',
        component: CatalogPage,
        props: (route) => ({ categoryId: route.query.category })
    },
    {
        path: '/product/:id',
        name: 'product',
        component: ProductPage,
        props: true
    }
    // {
    //     path: '/admin',
    //     component: () => import('../pages/AdminPanel.vue'),
    //     meta: { requiresAuth: true },
    //     children: [
    //       {
    //         path: '',
    //         redirect: '/admin/products'
    //       },
    //       {
    //         path: 'products',
    //         component: () => import('./views/AdminProducts.vue')
    //       },
    //       // ...другие админ-роуты
    //     ]
    //   },
    //   {
    //     path: '/admin/login',
    //     component: () => import('../pages/AdminLogin.vue')
    //   }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
      const isAuthenticated = await validateToken();
      if (!isAuthenticated) {
        return next('/admin/login');
      }
    }
    next();
  });

export default router;