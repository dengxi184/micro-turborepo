import { createRouter, createWebHistory } from 'vue-router';

// export interface RouteRecordRaw {
//   path: string
//   redirect?: string
//   component?: () => Promise<typeof import("*.vue")>
//   children?: RouteRecordRaw[]
// }

export const routes = [
  // {
  //   path: "/project",
  //   name: "Project",
  //   children: [
  //     {
  //       name: 'Optimization',
  //       path: 'optimization',
  //       component: () => import('../pages/Home/components/Project/Optimization/index.vue')
  //     },
  //     {
  //       name: 'Difficulty',
  //       path: 'difficulty',
  //       component: () => import('../pages/Home/components/Project/Difficulty/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: "/knowledge",
  //   name:'Knowledge',
  //   children:[
  //     {
  //       name: 'React',
  //       path: 'react',
  //       component: () => import('../pages/Home/components/Knowledge/React/index.vue'),
  //     },
  //     {
  //       name: 'Vue',
  //       path: 'vue',
  //       component: () => import('../pages/Home/components/Knowledge/Vue/index.vue'),
  //     }
  //   ]
  // },
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
