<template>
    <!-- ... -->
    <h5>{{ selectedRecipe?.title }}</h5>
    <h2>{{ selectedRecipe?.description }}</h2>
    <!-- ... -->
  </template>
  
  <script setup lang="ts">
  import { useSelectedRecipeStore } from '@/stores/selectedRecipe';
  const selectedRecipeStore = useSelectedRecipeStore();
  const selectedRecipe = selectedRecipeStore.item;
  </script>