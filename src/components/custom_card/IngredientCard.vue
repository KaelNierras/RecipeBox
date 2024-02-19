<template>
  <div
    class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Ingredients</h5>
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
            <button v-if="state.isEditing" @click="deleteIngredient(index)"
              class="text-red-500 hover:text-red-700 mr-4">Delete</button>
              <button v-if="state.isEditing" @click="editIngredient(index)"
                class="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ ingredient.title }}
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                {{ `${ingredient.quantity} x ${ingredient.price} ${ingredient.details}` }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {{ '₱ ' + ingredient.quantity * ingredient.price}}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="state.isEditing" class="mb-4 flex gap-3 flex-col">
      <input v-model="state.newingredient.title" type="text" placeholder="Title"
        class="border rounded p-2 w-full text-black ">
      <input v-model="state.newingredient.details" type="text" placeholder="Details"
        class="border rounded p-2 w-full text-black ">
      <div class="flex flex-row">
        <input v-model="state.newingredient.quantity" type="number" placeholder="Quantity"
        class="border rounded p-2 w-full text-black ">
        <input v-model="state.newingredient.price" type="number" placeholder="Price"
        class="border rounded p-2 w-full text-black ">
      </div>
      <button @click="addInstruction" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Add ingredient</button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { watchEffect, reactive, computed } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import {useTotalIngredientAmount} from  '@/stores/TotalIngredientAmount'

interface Props {
  id: string
}

const props = defineProps<Props>()

const state = reactive({
  ingredients: [] as { title: string, details: string, price: number, quantity: number}[],
  newingredient: { title: '', details: '', price: '', quantity: ''},
  isEditing: false,
  editingIndex: null as number | null
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
  updateTotalAmount();
})

const totalCost = computed(() => {
  return state.ingredients.reduce((total: number, ingredient: { quantity: number; price: number; }) => total + ingredient.quantity * ingredient.price, 0);
});

const selectedRecipeStore = useTotalIngredientAmount();

const updateTotalAmount = () => {
  //console.log('totalCost.value', totalCost.value);
  selectedRecipeStore.totalAmount({
    id: 'unique-id',
    amount: totalCost.value
  });
};


const deleteIngredient = (index: number) => {
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
    updateTotalAmount();
  }
};

const editIngredient = (index: number) => {
  state.newingredient = {
    ...state.ingredients[index],
    price: state.ingredients[index].price.toString(),
    quantity: state.ingredients[index].quantity.toString()
  };
  state.editingIndex = index;
};

const addInstruction = () => {
  if (state.newingredient.title) {
    if (state.isEditing && state.editingIndex !== null) {
      // Update the ingredient being edited
      state.ingredients[state.editingIndex] = {
        title: state.newingredient.title,
        details: state.newingredient.details,
        price: Number(state.newingredient.price),
        quantity: Number(state.newingredient.quantity),
      };
    } else {
      // Add a new ingredient
      state.ingredients.push({
        title: state.newingredient.title,
        details: state.newingredient.details,
        price: Number(state.newingredient.price),
        quantity: Number(state.newingredient.quantity),
      });
    }

    // Clear the input fields and exit editing mode
    state.newingredient.title = '';
    state.newingredient.details = '';
    state.newingredient.price = '';
    state.newingredient.quantity = '';
  }
};
</script>