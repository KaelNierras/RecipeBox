<template>
  <div class="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <ToastNotification :show="showToast" :message="toastMessage" />
  </div>
  <div class="pt-14 w-full min-h-screen flex flex-col">
    <div class="w-full md:h-52 h-56 relative bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="absolute top-0 left-0 p-7 mt-2">
        <div v-if="!isEditing">
          <div class="flex flex-row justify-start items-center gap-2">
            <span class="material-symbols-outlined bg-green-700 p-1 rounded text-white hover:cursor-pointer" @click="isEditing = true">
              edit
            </span>
            <h1 class="text-3xl sm:text-5xl font-bold text-white">{{ selectedRecipe?.title }}</h1>

          </div>
          <p class="pt-2 max-w-md text-white">{{ selectedRecipe?.description }}</p>
        </div>
        <div class="flex flex-col" v-if="isEditing">
          <div class="flex flex-row justify-center items-center gap-2">
            <span class="material-symbols-outlined bg-green-700 p-1 rounded text-white hover:cursor-pointer" @click="updateTitleandDescription">
              edit
            </span>
            <input v-model="title" type="text" placeholder="Quantity" class="border rounded p-2 w-full text-black ">

          </div>
          <Textarea id="description" v-model="description" 
                    class="appearance-none box-border text-gray-700 bg-white mt-2" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-9 w-full flex-grow bg-slate-200 dark:bg-gray-700 rounded-t-3xl -mt-8 z-30 p-10">
      <div class="flex flex-col md:flex-row justify-center gap-10 sm:flex-col lg:flex-row">
        <IngredientCard v-if="!isLoading" :id="state.docId" />
        <InstructionsCard v-if="!isLoading" :id="state.docId" />
        <SummaryCard />
      </div>
      <div class="flex justify-end items-end ">

        <button @click="isFavorite()"
          :class="{ ' bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4 text-white': state.favorite, 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800': !state.favorite }"
          type="button">
          <span class="material-symbols-outlined">
            {{ state.favorite ? 'heart_check' : 'favorite' }}
          </span>
        </button>


        <button @click="showModal = true"
          class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          type="button">
          <span class="material-symbols-outlined">
            delete
          </span>
        </button>

        <div v-if="showModal" class="flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 z-50">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" @click="showModal = false"
                class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="p-4 md:p-5 text-center">
                <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete
                  this Recipe?</h3>
                <button data-modal-hide="popup-modal" type="button" @click="deleteRecipe"
                  class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  Yes, I'm sure
                </button>
                <button data-modal-hide="popup-modal" type="button" @click="showModal = false"
                  class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No,
                  cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { collection, getDocs, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { useSelectedRecipeStore } from '@/stores/selectedRecipe';
import IngredientCard from '@/components/custom_card/IngredientCard.vue'
import InstructionsCard from '@/components/custom_card/InstructionsCard.vue'
import SummaryCard from '@/components/custom_card/SummaryCard.vue'
import { db } from '@/firebase';
import { query } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import ToastNotification from './ToastNotification.vue';
import { Textarea } from '@/components/ui/textarea'

const selectedRecipeStore = useSelectedRecipeStore();
const selectedRecipe = selectedRecipeStore.item;
var title = ref(selectedRecipe?.title);
var description = ref(selectedRecipe?.description);
const bgImage = ref();
var isEditing = ref(false);
const state = reactive({
  docId: '', // Changed from String to string
  imageName: '', // Changed from String to string
  favorite: false,
});

const router = useRouter();
const showModal = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  const selectedTitle = selectedRecipe?.title;
  await fetchRecipeData(selectedTitle);
});

async function fetchRecipeData(selectedTitle: any) {
      try {
        const q = query(collection(db, 'recipe'), where('title', '==', selectedTitle), where('userId', '==', localStorage.getItem('currentUserId')));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const matchingRecipe = querySnapshot.docs[0];
          const matchingRecipeData = matchingRecipe.data();

          if (matchingRecipeData.image) {
            bgImage.value = matchingRecipeData.image;
          }

          state.docId = matchingRecipe.id;
          state.imageName = matchingRecipeData.imageName;
          state.favorite = matchingRecipeData.isFavorite;
          isLoading.value = false;
        } else {
          console.warn(`No matching recipe found for title: ${selectedTitle}`);
        }
      } catch (error) {
        console.error('Error fetching image from Firestore:', error);
        isLoading.value = false;
      }
    }

const deleteRecipe = async () => {
  if (localStorage.getItem('recipeCount') == '1') {
    localStorage.setItem('recipeCount', '0');
  }
  if (state.docId) {
    await deleteDoc(doc(db, 'recipe', state.docId)); // This should work now
    const storage = getStorage();
    const imageRef = storageRef(storage, `/images/${state.imageName}`);
    await deleteObject(imageRef);
    window.alert('Recipe deleted successfully.');
    router.push('/Recipe');
  }
};

const updateTitleandDescription = async () => {
  if (state.docId) {
    const recipeRef = doc(db, 'recipe', state.docId);
    await updateDoc(recipeRef, {
      title: title.value,
      description: description.value,
    });
    isEditing.value = false;
    await fetchRecipeData(title.value);
    // Refresh the browser
    router.push('/Recipe');
  }
};

const isFavorite = async () => {
  const recipeRef = doc(db, "recipe", state.docId)

  state.favorite = !state.favorite
  await updateDoc(recipeRef, {
    isFavorite: state.favorite
  })

  if (state.favorite) {
    toastMessage.value = 'Successfully added to favorites!';
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
}

const showToast = ref(false);
const toastMessage = ref('');

</script>