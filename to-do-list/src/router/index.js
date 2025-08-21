import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('./home.vue'),
        name: 'home',
        meta: { requiresAuth: true } 
    },
    {
        path: '/login',
        component: () => import('./login.vue'),
        name: 'login'
    },
    {
        path: '/register',
        component: () => import('./register.vue'),
        name: 'register'
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('./err.vue'),
        name: 'err'
    }
]

// Cria o router primeiro
const router = createRouter({
    history: createWebHistory(),
    routes
})

// Agora adiciona a guarda
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router
