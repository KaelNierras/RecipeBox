<template>
  <div
    class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Instructions</h5>
      <button @click="toggleEditing"
        :class="{ 'text-green-600 dark:text-green-400': state.isEditing, 'text-blue-600 dark:text-blue-500': !state.isEditing }"
        class="text-sm font-medium hover:underline">
        {{ state.isEditing ? 'Done' : 'Edit' }}
      </button>
    </div>

    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="(instruction, index) in state.instructions" :key="index" class="py-3 sm:py-4">
          <div class="flex items-center">
            <button v-if="state.isEditing" @click="deleteInstruction(index)"
      class="text-red-500 hover:text-red-700 mr-4">Delete</button>
            <button v-if="state.isEditing" @click="editInstruction(index)"
              class="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
              <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ `${instruction.title} (${instruction.time} mins)` }}
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                {{ instruction.details }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {{ index + 1 }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    

    <div v-if="state.isEditing" class="mb-4 flex gap-3 flex-col">
      <input v-model="state.newInstruction.title" type="text" placeholder="Title"
        class="border rounded p-2 w-full text-black ">
      <input v-model="state.newInstruction.details" type="text" placeholder="Details"
        class="border rounded p-2 w-full text-black ">
      <input v-model="state.newInstruction.time" type="number" placeholder="Time in Minutes"
        class="border rounded p-2 w-full text-black ">
      <button @click="addInstruction" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        {{ state.isAdding ? 'Edit instruction' : 'Add instruction' }}
      </button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { watchEffect, reactive, computed } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import {useTotalCookingTime} from  '@/stores/TotalCookingTime'

interface Props {
  id: string
}

const props = defineProps<Props>()

const state = reactive({
  instructions: [] as { title: string, details: string, time: number}[],
  newInstruction: { title: '', details: '', time: '' as any},
  isEditing: false,
  isAdding: false,
  editingIndex: null as number | null
});

watchEffect(async () => {
  if (props.id) {
    const docRef = doc(db, 'recipe', props.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      state.instructions = docSnap.data().instructions
      console.log('Document data:', state.instructions)
    } else {
      console.log('No such document!')
    }
  }
  updateTotalTime();
})

const totalTime = computed(() => {
  return state.instructions.reduce((total: number, instructions: { time: number}) => total + instructions.time , 0);
});

const selectedRecipeStore = useTotalCookingTime();

const updateTotalTime = () => {
  selectedRecipeStore.totalTime({
    id: 'unique-id',
    time: totalTime.value
  });
};

const updateInstructions = async () => {
  if (props.id) {
    const docRef = doc(db, 'recipe', props.id)
    await updateDoc(docRef, {
      instructions: state.instructions
    });
  }
};

const toggleEditing = () => {
  state.isEditing = !state.isEditing;
  if (!state.isEditing) {
    updateInstructions();
    updateTotalTime();
    state.isAdding = false;
  }
};

const deleteInstruction = (index: number) => {
  state.instructions.splice(index, 1);
};

const editInstruction = (index: number) => {
  state.isAdding = true;
  state.newInstruction = { ...state.instructions[index] };
  state.editingIndex = index;
};

const addInstruction = () => {
  if (state.newInstruction.title) {
    if (state.editingIndex !== null) {
      // If an instruction is being edited, update it
      state.instructions[state.editingIndex] = {
        title: state.newInstruction.title,
        details: state.newInstruction.details,
        time: state.newInstruction.time,
      };
      state.editingIndex = null; // Reset the editing index
    } else {
      // If no instruction is being edited, add a new one
      state.instructions.push({
        title: state.newInstruction.title,
        details: state.newInstruction.details,
        time: state.newInstruction.time,
      });
    }
    // Clear the input fields
    state.newInstruction.title = '';
    state.newInstruction.details = '';
    state.newInstruction.time = '';
  }
};
</script>