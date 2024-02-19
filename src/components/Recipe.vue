<template>
  <div class="pt-20 px-4 flex flex-wrap">
    <div class="flex flex-col justify-center text-center w-full" v-if="getrecipeCount === '0'">
      <h1 class="text-gray-400 dark:text-gray-700 text-2xl sm:text-2xl md:text-3xl font-semibold">
        "Oops! No recipe found!"</h1>
      <span class="material-symbols-outlined text-gray-400 dark:text-gray-700  text-7xl">
        sentiment_very_dissatisfied
      </span>

    </div>

    <div v-for="(item, index) in recipes" :key="index" @click="selectAndGoToRecipe(item)"
      class="m-3 w-96 h-64 overflow-auto p-6 bg-white rounded-lg shadow dark:bg-gray-800 relative">
      <div class="absolute inset-0 bg-black opacity-90  dark:opacity-40"
        :style="{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }"></div>
      <div class="relative">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white drop-shadow-text">
            {{ item.title }}
          </h5>
        </a>
        <p class="mb-3 font-normal text-white h-28 dark:text-white drop-shadow-text">
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

    <div class="modal fixed inset-0 flex items-center justify-center z-20" :class="{ 'show': isAddButtonClicked }"
      v-if="isAddButtonClicked">
      <div v-if="isAddButtonClicked" class="fixed inset-0 bg-black opacity-80 z-10"></div>
      <div class="fixed inset-0 flex items-center justify-center z-20" v-if="isAddButtonClicked">
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Create Recipe</CardTitle>
            <CardDescription>Make Delicious Recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="addRecipeForm" @submit.prevent="addRecipe">
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="title">Recipe Title</Label>
                  <Input id="title" v-model="newRecipe.title" placeholder="Title of Recipe"
                    class="appearance-none box-border" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="description">Description</Label>
                  <Textarea id="description" v-model="newRecipe.description" placeholder="Write a Short Description"
                    class="appearance-none box-border" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="image">Cover Photo</Label>
                  <input id="image" type="file" @change="onFileChange" class="appearance-none box-border" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter class="flex justify-between px-6 pb-6">
            <Button variant="outline" @click="closeAddRecipe">
              Cancel
            </Button>
            <Button type="submit" form="addRecipeForm">Add</Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <button @click="OpenModal"
      class="w-12 h-12 fixed bottom-6 right-6 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <span class="material-symbols-outlined text-center">
        add
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, computed } from 'vue';
import { db } from '@/firebase';  // import the db constant
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { useSelectedRecipeStore } from '@/stores/selectedRecipe';
import { uploadBytes, getDownloadURL, ref as refStore } from 'firebase/storage';
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

//Text Area
import { Textarea } from '@/components/ui/textarea'

//Card
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'


// Define an interface for your recipe data
interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
}

const recipes = ref(<Recipe[]>([]));
const user_id = ref('');

const getrecipeCount = computed(() => {
  console.log(localStorage.getItem('recipeCount'));
  return (localStorage.getItem('recipeCount') ?? '0');
});

const auth = getAuth();
setPersistence(auth, browserSessionPersistence);

onMounted(async () => {
  auth.onAuthStateChanged(async (user) => {
    if (user !== null) {
      user_id.value = user.uid;
      const q = query(collection(db, "recipe"), where("userId", "==", user.uid));
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
    }
  });
});

let isAddButtonClicked = ref(false);

const OpenModal = () => {
  setTimeout(() => {
    isAddButtonClicked.value = true;
  }, 300);
};
const closeAddRecipe = () => {
  isAddButtonClicked.value = false;
};

let newRecipe = ref({
  title: '',
  description: '',
  image: ''
});

const addRecipe = async () => {
  try {
    // Check if selectedFile is not null before accessing its name property
    if (!selectedFile.value) {
      throw new Error('No file selected.');
    }

    // Create a root reference
    const storage = getStorage();

    // Upload the image to Firebase Storage
    const storageRef = refStore(storage, 'images/' + selectedFile.value.name);
    await uploadBytes(storageRef, selectedFile.value);

    // Get the download URL for the uploaded image
    const imageURL = await getDownloadURL(storageRef);

    // Add the new recipe to the Firebase collection with the image URL
    const recipeRef = await addDoc(collection(db, 'recipe'), {
      title: newRecipe.value.title,
      description: newRecipe.value.description,
      image: imageURL,
      imageName: selectedFile.value.name,
      ingredients: [],
      instructions: [],
      userId: user_id.value,
    });

    // Update the local recipes array with the new recipe's ID
    recipes.value.push({
      id: recipeRef.id,
      title: newRecipe.value.title,
      description: newRecipe.value.description,
      image: imageURL,
    });

    // Reset the newRecipe values and close the modal
    newRecipe.value = {
      title: '',
      description: '',
      image: '',
    };

    // Show an alert
    window.alert('Recipe added successfully.');

    isAddButtonClicked.value = false;
  } catch (error) {
    console.error('Error adding recipe to Firebase:', error);
    // Handle error appropriately
  }
};



let selectedFile = ref<File | null>(null);

const onFileChange = (e: Event) => {
  selectedFile.value = ((e.target as HTMLInputElement)?.files?.[0] || null);
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

<style scoped>
.modal {
  transition: transform 0.3s ease-out;
  transform: scale(0);
}

.modal.show {
  transform: scale(1);
}

.drop-shadow-text {
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.6);
}
</style>