<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initFlowbite } from 'flowbite'
import { RouterView } from 'vue-router';
import { Button } from '@/components/ui/button'
import { useRoute, useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const user_name = ref('');
const email = ref('');
const photoURL = ref('');

const route = useRoute();
const router = useRouter();

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

const signOut = async () => {
   try {
      await auth.signOut();
      router.push('/');
      localStorage.removeItem('user_name');
      localStorage.removeItem('email');
      localStorage.removeItem('photoURL');
      localStorage.removeItem('hasShownToast');
      localStorage.removeItem('hasShownToastOut');
      localStorage.removeItem('currentUserId');

   } catch (error) {
      window.alert(`Error signing in with email and password: ${(error as any).message}`);
   }
};
onMounted(() => {
   const body = document.querySelector('body');
   body?.classList.toggle('dark', darkMode.value);
   initFlowbite();

   onAuthStateChanged(auth, (currentUser) => {
      if (currentUser !== null) {
         // The user object has basic properties such as display name, email, etc.
         let storedUserName = localStorage.getItem('user_name');
         let storedEmail = localStorage.getItem('email');
         let storedPhotoURL = localStorage.getItem('photoURL');

         localStorage.setItem('currentUserId', currentUser.uid ?? '');
         if (storedUserName === null) {
            storedUserName = currentUser.displayName ?? '';
            localStorage.setItem('user_name', storedUserName);
         }

         if (storedEmail === null) {
            storedEmail = currentUser.email ?? '';
            localStorage.setItem('email', storedEmail);
         }

         if (storedPhotoURL === null) {
            storedPhotoURL = currentUser.photoURL ?? '';
            localStorage.setItem('photoURL', storedPhotoURL);
         }

         user_name.value = storedUserName;
         email.value = storedEmail;
         photoURL.value = storedPhotoURL;


      }
   });
});

</script>

<template>
   <!-- Top Bar -->
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
       
               <router-link :to="{ path: '/dashboard' }"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                  <img :src="darkMode ? '/recipes-light.svg' : '/recipes.svg'" class="h-6 me-3" alt="RecipeBox Logo" />
                  <div class="text-2xl font-bold">Recipe Box</div>
               </router-link>

            </div>
            <div class="flex items-center">

               <div class="flex items-center ms-3">
                  <Button variant="ghost" size="sm" class="mr-0" @click="toggleDarkMode">
                     <span class="material-symbols-outlined" v-if="darkMode">
                        light_mode
                     </span>
                     <span class="material-symbols-outlined" v-else>
                        dark_mode
                     </span>
                  </Button>
                  <Button variant="ghost" size="sm" class="mr-4" @click="signOut">
                     <span class="material-symbols-outlined">
                        <span class="material-symbols-outlined">
                           logout
                        </span>
                     </span>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   </nav>

   <!-- Sidebar -->
   <aside id="logo-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-slate-100 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar">
      <div class="h-full px-3 pb-4 overflow-y-auto bg-slate-100 dark:bg-gray-800 d-flex flex-column justify-content-between">
         <div class="flex flow-row justify-Start ml-2 items-center mt-2">
            <img :src="photoURL" class="w-8 h-8 rounded-full mr-2" alt="Profile Picture" /> 
            <div class="flex flex-col justify-center items-start">
               <p class=" text-xs"> {{ user_name }}</p>
               <p class=" text-xs"> {{ email }}</p>
            </div>  
         </div>
         <hr class=" border-gray-700 dark:border-white my-6">
         <ul class="space-y-2 font-medium">
            <li>
               <router-link :to="{ path: '/dashboard' }"
                  :class="{ 'bg-gray-700': darkMode && isActive('/dashboard'), 'bg-gray-300': !darkMode && isActive('/dashboard') }"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                  <span
                     :class="{ 'text-gray-900': darkMode && isActive('/dashboard'), 'text-gray-500': !darkMode && isActive('/dashboard') }"
                     class="material-symbols-outlined flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                     dashboard_customize
                  </span>
                  <span class="ms-3">Dashboard</span>
               </router-link>

            </li>
            <li>
               <router-link :to="{ path: '/recipe' }"
                  :class="{ 'bg-gray-700': darkMode && isActive('/recipe'), 'bg-gray-300': !darkMode && isActive('/recipe') }"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
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

   <div class="sm:ml-64">
      <div class="">
         <RouterView />
      </div>
   </div>
</template>