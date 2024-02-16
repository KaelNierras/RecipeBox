<template>
  <div
    class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Ingredient</h5>
      <button @click="toggleEditing"
        :class="{ 'text-green-600 dark:text-green-400': state.isEditing, 'text-blue-600 dark:text-blue-500': !state.isEditing }"
        class="text-sm font-medium hover:underline">
        {{ state.isEditing ? 'Done' : 'Edit' }}
      </button>
    </div>

    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="(ingredient, index) in state.ingredients" :key="index" class="py-3 sm:py-4">
          <div class="flex items-center">
            <button v-if="state.isEditing" @click="deleteCustomer(index)"
              class="text-red-500 hover:text-red-700 mr-4">Delete</button>
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ ingredient.title }}
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                {{ ingredient.details }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {{ '₱' + ingredient.price }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="state.isEditing" class="mb-4 flex gap-3 flex-col">
      <input v-model="state.newingredient.title" type="text" placeholder="New ingredients title"
        class="border rounded p-2 w-full text-black ">
      <input v-model="state.newingredient.details" type="text" placeholder="New ingredients details"
        class="border rounded p-2 w-full text-black ">
        <input v-model="state.newingredient.price" type="text" placeholder="New ingredients price"
        class="border rounded p-2 w-full text-black ">
      <button @click="addInstruction" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Add instruction</button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { watchEffect, reactive } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

interface Props {
  id: string
}

const props = defineProps<Props>()

const state = reactive({
  ingredients: [] as { title: String, details: String, price: string}[],
  newingredient: { title: '', details: '', price: ''},
  isEditing: false
});

watchEffect(async () => {
  if (props.id) {
    const docRef = doc(db, 'recipe', props.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      state.ingredients = docSnap.data().ingredients
      console.log('Document data:', state.ingredients)
    } else {
      console.log('No such document!')
    }
  }
})

const deleteCustomer = (index: number) => {
  state.ingredients.splice(index, 1);
};

const updateInstructions = async () => {
  if (props.id) {
    const docRef = doc(db, 'recipe', props.id)
    await updateDoc(docRef, {
      ingredients: state.ingredients
    });
  }
};

const toggleEditing = () => {
  state.isEditing = !state.isEditing;
  if (!state.isEditing) {
    updateInstructions();
  }
};

const addInstruction = () => {
  if (state.newingredient.title) {
    state.ingredients.push({
      title: state.newingredient.title,
      details: state.newingredient.details,
      price: state.newingredient.price,
    });
    state.newingredient.title = ''; // Clear the input field after adding the instruction
    state.newingredient.details = ''; // Clear the input field after adding the instruction
    state.newingredient.price = ''; // Clear the input field after adding the instruction
  }
};
</script>