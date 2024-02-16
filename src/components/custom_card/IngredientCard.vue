<template>
  <div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Ingredients</h5>
      <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
        Edit
      </a>
    </div>
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="(customer, index) in customers" :key="index" class="py-3 sm:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <!-- You can uncomment the image tag and provide actual image sources if needed -->
              <!-- <img class="w-8 h-8 rounded-full" :src="customer.imageSrc" :alt="`${customer.name} image`"> -->
            </div>
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ customer.name }}
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                {{ customer.email }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {{ customer.amount }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
const customers = ref([
  { name: 'Neil Sims', email: 'email@windster.com', amount: '$320' },
  { name: 'Bonnie Green', email: 'email@windster.com', amount: '$3467' },
  { name: 'Michael Gough', email: 'email@windster.com', amount: '$67' },
  { name: 'Lana Byrd', email: 'email@windster.com', amount: '$367' },
  { name: 'Thomes Lean', email: 'email@windster.com', amount: '$2367' },
]);
</script>
