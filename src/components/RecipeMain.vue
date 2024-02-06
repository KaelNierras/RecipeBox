<template>
    <div class="pt-14 w-full h-screen flex flex-col">
        <div class="w-full h-56 relative bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})`}">
            <div class="absolute inset-0 bg-black opacity-50"></div>
            <div class="absolute top-0 left-0 p-7">
                <h1 class=" text-4xl font-bold text-white">{{ selectedRecipe?.title }}</h1>
                <p class="pt-2 max-w-md text-white">{{ selectedRecipe?.description }}</p>
            </div>
        </div>
        <div class="flex w-full flex-grow bg-slate-200 dark:bg-gray-700 rounded-t-3xl -mt-8 z-30">


        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSelectedRecipeStore } from '@/stores/selectedRecipe';
  const selectedRecipeStore = useSelectedRecipeStore();
  const selectedRecipe = selectedRecipeStore.item;

const bgImage = ref('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
</script>