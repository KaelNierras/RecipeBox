import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from '../views/DashboardView.vue';
import Recipe from '../views/RecipeView.vue';
import RecipeMain from '../views/RecipeMainView.vue';
import LoginRegister from '../views/LoginRegisterView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'loginandregister',
    component: LoginRegister,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/recipe',
    name: 'recipe',
    component: Recipe,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/recipemain',
    name: 'recipemain',
    component: RecipeMain,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let isAuthReady = false;

const auth = getAuth();
onAuthStateChanged(auth, () => {
  if (!isAuthReady) {
    isAuthReady = true;
  }
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const isAuthenticated = auth.currentUser != null;

  if (!isAuthReady) {
    // Wait for auth to initialize.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if ((requiresAuth && !user) || (requiresGuest && user)) {
        next('/');
      } else {
        next();
      }
    });
  } else {
    if ((requiresAuth && !isAuthenticated) || (requiresGuest && isAuthenticated)) {
      next('/');
    } else {
      next();
    }
  }
});

export default router;