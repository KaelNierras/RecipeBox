<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initFlowbite } from 'flowbite'
import { RouterView } from 'vue-router';
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (routePath: string): boolean => { 
  console.log(routePath)
  return route.path === routePath;
};
const darkMode = ref(getDarkMode());

function getDarkMode() {
   // Try to get the dark mode setting from localStorage
   const storedDarkMode = localStorage.getItem('darkMode');

   // If the setting exists, return it (converted to a boolean)
   if (storedDarkMode !== null) {
      return storedDarkMode === 'true';
   }

   // Otherwise, determine the setting based on the body class
   const body = document.querySelector('body');
   const isDark = body?.classList.contains('dark');
   return isDark;
}

function toggleDarkMode() {
   darkMode.value = !darkMode.value;

   // Store the new setting in localStorage
   localStorage.setItem('darkMode', darkMode.value.toString());

   const body = document.querySelector('body');
   body?.classList.toggle('dark', darkMode.value);
}

onMounted(() => {
  const body = document.querySelector('body');
  body?.classList.toggle('dark', darkMode.value);
  initFlowbite();
});

</script>

<template>
   <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
         <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
               <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar"
                  type="button"
                  class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                  <span class="sr-only">Open sidebar</span>
                  <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                     <path clip-rule="evenodd" fill-rule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                     </path>
                  </svg>
               </button>
               <!-- <a href="/" class="flex ms-2 md:me-24">
                  <img :src="darkMode ? '/logo_dark.png' : '/logo_light.png'" class="h-9 me-3" alt="VoteHub Logo" />
               </a> -->
               <span class="material-symbols-outlined mx-2">
                  restaurant
               </span>
               <div class="text-2xl font-bold">Recipe Box</div>
            </div>
            <div class="flex items-center">
               <div class="flex items-center ms-3">
                  <Button variant="ghost" size="sm" class="mr-4" @click="toggleDarkMode">
                     <span class="material-symbols-outlined">
                        dark_mode
                     </span>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   </nav>

   <aside id="logo-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar">
      <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
         <ul class="space-y-2 font-medium">
            <li>
               <router-link :to="{ path: '/' }"
                  :class="{ 'bg-gray-700': darkMode && isActive('/'), 'bg-gray-100': !darkMode && isActive('/') }"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span
                     :class="{ 'text-gray-900': darkMode && isActive('/'), 'text-gray-500': !darkMode && isActive('/') }"
                     class="material-symbols-outlined flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                     dashboard_customize
                  </span>
                  <span class="ms-3">Dashboard</span>
               </router-link>

            </li>
            <li>
               <router-link 
                  :to="{ path: '/recipe' }"
                  :class="{ 'bg-gray-700': darkMode && isActive('/recipe'), 'bg-gray-100': !darkMode && isActive('/recipe') }"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span
                     :class="{ 'text-gray-900': darkMode && isActive('/recipe'), 'text-gray-500': !darkMode && isActive('/recipe') }"
                     class="material-symbols-outlined flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                     menu_book
                  </span>
                  <span class="flex-1 ms-3 whitespace-nowrap">Recipe</span>
               </router-link>
            </li>
      </ul>
   </div>
</aside>

<div class="p-4 sm:ml-64">
   <div class="mt-14">
      <RouterView />
   </div>
</div>

</template>