<template>
  <div
    class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Summary</h5>
      <!-- <button @click="toggleEditing"
        :class="{ 'text-green-600 dark:text-green-400': state.isEditing, 'text-blue-600 dark:text-blue-500': !state.isEditing }"
        class="text-sm font-medium hover:underline">
        {{ state.isEditing ? 'Done' : 'Edit' }}
      </button> -->
    </div>

    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="py-3 sm:py-4">
          <div class="flex items-center">
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                Overall Cost
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                of the ingredients
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {{ TotalAmount?.amount }}
            </div>
          </div>  
        </li>
        <li class="py-3 sm:py-4">
          <div class="flex items-center">
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                Cooking Time
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                of the ingredients
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {{ TotalTime?.time }}
            </div>
          </div>  
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { watchEffect,ref } from 'vue'
import {useTotalIngredientAmount} from  '@/stores/TotalIngredientAmount'
import {useTotalCookingTime} from  '@/stores/TotalCookingTime'

const TotalIngredientAmount = useTotalIngredientAmount();
const TotalIngredientTime = useTotalCookingTime();
var TotalAmount = ref(TotalIngredientAmount.amount);
var TotalTime = ref(TotalIngredientTime.time);

watchEffect(() => {
  TotalAmount.value = TotalIngredientAmount.amount;
  TotalTime.value = TotalIngredientTime.time;
});





</script>