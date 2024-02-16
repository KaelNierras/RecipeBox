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
import useSelectedRecipeStore from '@/stores/selectedRecipe'
import { useRouter } from 'vue-router'

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
}

const auth = getAuth()
setPersistence(auth, browserSessionPersistence);
const recipeCount = ref(0)
const favoriteCount = ref(0)
const currentDate = ref('')
const recipes = ref(<Recipe[]>([]));
const user_id = ref('');

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user !== null) {
      user_id.value = user.uid;
      const q = query(collection(db, "recipe"), where("userId", "==", user.uid), );
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
      recipeCount.value = querySnapshot.size
    }
    recipes.value =[];
    if (user !== null) {
      user_id.value = user.uid;
      const q = query(collection(db, "recipe"), where("userId", "==", user.uid),  where("isFavorite", "==", true));
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
      favoriteCount.value = querySnapshot.docs.filter(doc => doc.data().isFavorite).length
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
  <div class=" pt-20 px-4 grid gap-1 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Total Number of Receipes
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
          Total Number of Favorite
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
  <div class="pt-5 px-4 flex flex-wrap flex-col">
    <h3 class="text-lg font-bold p-2" v-if="recipes.length > 0">Favorites</h3>
    <div v-for="(item, index) in recipes" :key="index" @click="selectAndGoToRecipe(item)"
      class="m-3 w-auto h-64 overflow-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 relative">
      <div class="absolute inset-0 bg-black opacity-35  dark:opacity-40"
        :style="{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }"></div>
      <div class="relative">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-800  dark:text-white    ">
            {{ item.title }}
          </h5>
        </a>
        <p class="mb-3 font-normal text-gray-800 h-28 dark:text-white">
          {{ item.description }}
        </p>
        <a href="#"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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


