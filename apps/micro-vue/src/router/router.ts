import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home/index.vue'),
  },
  {
    path: '/write',
    name: 'Write',
    component: () => import('../pages/Write/index.vue'),
  },
  {
    path: '/details',
    name: 'Details',
    component: () => import('../pages/Details/index.vue'),
  },
  {
    path: '/',
    redirect: '/home',
  },
];
const router = createRouter({
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  history: createWebHistory(
    window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  ),
  routes,
});

export default router;
