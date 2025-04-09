import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage/MainPage.vue";
import AboutUsPage from "../pages/AboutUs/AboutUsPage.vue";
import ContactsPage from "../pages/ContactsPage/ContactsPage.vue";
import CatalogPage from "../pages/CatalogPage/CatalogPage.vue";

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
        name: CatalogPage,
        component: CatalogPage,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;