import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from '../views/DashboardView.vue';
import Recipe from '../views/RecipeView.vue';
import RecipeMain from '../views/RecipeMainView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/recipe',
    name: 'recipe',
    component: Recipe,
  },
  {
    path: '/recipemain',
    name: 'recipemain',
    component: RecipeMain,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;