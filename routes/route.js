import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage/MainPage.vue";

const routes = [
    {
        path: '/',
        name: MainPage,
        component: MainPage,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;