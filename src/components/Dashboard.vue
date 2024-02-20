<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { query, where, getDocs, collection } from 'firebase/firestore'
import { db } from '@/firebase' // replace with your Firebase initialization file
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSelectedRecipeStore } from '@/stores/selectedRecipe'
import { useRouter } from 'vue-router'
import ToastNotification from './ToastNotification.vue';


interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
}

const auth = getAuth()
setPersistence(auth, browserSessionPersistence);
const recipeCount = ref('')
const favoriteCount = ref('')
const currentDate = ref('')
const recipes = ref(<Recipe[]>([]));
const user_id = ref('');

const showToast = ref(false);
const toastMessage = ref('');

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user !== null && user.uid !== user_id.value) {
      user_id.value = user.uid;

      if (localStorage.getItem('hasShownToast') !== 'true') {
        toastMessage.value = 'Successfully Logged In!';
        showToast.value = true;
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
        localStorage.setItem('hasShownToast', 'true');
      }
      const q = query(collection(db, "recipe"), where("userId", "==", user.uid),);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        recipes.value.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          image: data.image
        });
      });
      recipeCount.value = querySnapshot.size.toString();
      localStorage.setItem('recipeCount', recipeCount.value.toString());
    }
    recipes.value = [];
    if (user !== null) {
      user_id.value = user.uid;
      const q = query(collection(db, "recipe"), where("userId", "==", user.uid), where("isFavorite", "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        recipes.value.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          image: data.image
        });
      });
      favoriteCount.value = querySnapshot.docs.filter(doc => doc.data().isFavorite).length.toString();
    }

  });
  getCurrentDate();
});
const getCurrentDate = () => {
  const now = new Date();
  const formattedDate = now.toDateString();
  currentDate.value = formattedDate;
};

const router = useRouter();
const selectedRecipeStore = useSelectedRecipeStore();

const selectAndGoToRecipe = (item: typeof recipes.value[0]) => {
  selectedRecipeStore.selectItem({ ...item, id: 'unique-id' });
  router.push({ name: 'recipemain' });
};

watchEffect(() => {
  localStorage.setItem('items', JSON.stringify(recipes.value));
});
</script>

<template>
  <div class="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
    <ToastNotification :show="showToast" :message="toastMessage" />
  </div>
  <div class=" pt-20 px-4 grid gap-1 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Total Number of Recipes
        </CardTitle>
        <span class="material-symbols-outlined">
          menu_book
        </span>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ recipeCount }}
        </div>
        <p class="text-xs text-muted-foreground">
          as of {{ currentDate }}
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Total Number of Favorites
        </CardTitle>
        <span class="material-symbols-outlined">
          favorite
        </span>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ favoriteCount }}
        </div>
        <p class="text-xs text-muted-foreground">
          as of {{ currentDate }}
        </p>
      </CardContent>
    </Card>
  </div>
  <div class="pt-5 px-4 flex flex-wrap flex-col gap-4" v-if="recipeCount == '0'">
    
    <h1 class="text-gray-600 dark:text-gray-300 text-3xl sm:text-2xl md:text-4xl font-semibold">Create your First Recipe!</h1>
    <router-link :to="{ path: '/recipe'}"
          class="flex items-center justify-center text-center py-2.5 px-3 text-sm font-medium text-white focus:outline-none bg-green-700 rounded-lg border border-gray-200 hover:bg-gray-400 hover:text-grey-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-green-700 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 w-32 h-12">
        Create Recipe
    </router-link>

  </div>
  <div class="pt-5 px-4 flex flex-wrap flex-col">
    <h3 class="text-lg font-bold p-2" v-if="recipes.length > 0">Favorites</h3>
    <div v-for="(item, index) in recipes" :key="index" @click="selectAndGoToRecipe(item)"
      class="m-3 w-auto h-64 overflow-auto p-6 bg-white rounded-lg shadow dark:bg-gray-800 relative">
      <div class="absolute inset-0 bg-black opacity-90  dark:opacity-40"
        :style="{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }"></div>
      <div class="relative">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-white  dark:text-white drop-shadow-text">
            {{ item.title }}
          </h5>
        </a>
        <p class="mb-3 font-normal text-white h-28 dark:text-white drop-shadow-text">
          {{ item.description }}
        </p>
        <a href="#"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          View Recipe
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-shadow-text {
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.6);
}
</style>