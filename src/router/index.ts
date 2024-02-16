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
      requiresAuth: false,
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

  // Listen for changes in the authentication state
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (requiresAuth && !user) {
      // If the route requires authentication and the user is not authenticated, redirect to login
      next('/');
    } else if (!requiresAuth && user) {
      // If the route does not require authentication and the user is authenticated, redirect to dashboard
      next('/dashboard');
    } else {
      // Allow access to the route
      next();
    }

    // Stop listening for further changes
    unsubscribe();
  });
});

export default router;