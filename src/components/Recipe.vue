<template>
  <div class="flex flex-wrap">

    <div v-for="(item, index) in items" :key="index"
      class="m-3 w-96 h-64 overflow-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 relative">
      <div class="absolute inset-0 bg-black opacity-35  dark:opacity-40"
        :style="{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }"></div>
      <div class="relative">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-800  dark:text-white    ">
            {{ item.title }}
          </h5>
        </a>
        <p class="mb-3 font-normal text-gray-800    dark:text-white">
          {{ item.description }}
        </p>
        <a href="#"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          View Recipe
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
      </div>
    </div>

    <div class="fixed inset-0 flex items-center justify-center" v-if="isAddButtonClicked">
      <Card class="w-[350px]">
        <CardHeader>
          <CardTitle>Create Recipe</CardTitle>
          <CardDescription>Make Delicious Recipes</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="addRecipeForm" @submit.prevent="addRecipe">
            <div class="grid items-center w-full gap-4">
              <div class="flex flex-col space-y-1.5">
                <Label for="title">Recipe Title</Label>
                <Input id="title" v-model="newRecipe.title" placeholder="Title of Recipe" class="appearance-none box-border" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <Label for="description">Description</Label>
                <Input id="description" v-model="newRecipe.description" placeholder="Description of Recipe" class="appearance-none box-border" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <Label for="framework">Framework</Label>
                <Select>
                  <SelectTrigger id="framework" class="appearance-none box-border">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="nuxt">
                      Nuxt.js
                    </SelectItem>
                    <SelectItem value="next">
                      Next.js
                    </SelectItem>
                    <SelectItem value="sveltekit">
                      SvelteKit
                    </SelectItem>
                    <SelectItem value="astro">
                      Astro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex flex-col space-y-1.5">
                <Label for="image">Image</Label>
                <input id="image" type="file" @change="onFileChange" class="appearance-none box-border" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          <Button variant="outline" @click="closeAddRecipe">
            Cancel
          </Button>
          <Button type="submit" form="addRecipeForm">Add</Button>
        </CardFooter>
      </Card>
    </div>

    <button @click="OpenModal"
      class="w-12 h-12 fixed bottom-6 right-6 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <span class="material-symbols-outlined text-center">
        add
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const items = ref([
  {
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    image: 'https://plus.unsplash.com/premium_photo-1663852297267-827c73e7529e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    image: 'https://plus.unsplash.com/premium_photo-1663852297267-827c73e7529e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    image: 'https://plus.unsplash.com/premium_photo-1663852297267-827c73e7529e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  // Add more items here
]);


let isAddButtonClicked = ref(false);

const OpenModal = () => {
  isAddButtonClicked.value = true;
};

const closeAddRecipe = () => {
  isAddButtonClicked.value = false;
};

let newRecipe = ref({
  title: '',
  description: '',
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
});

const addRecipe = () => {
  items.value.push(newRecipe.value);
  newRecipe.value = {
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  };
  isAddButtonClicked.value = false;
};

let selectedFile = ref<File | null>(null);

const onFileChange = (e: Event) => {
  selectedFile.value = ((e.target as HTMLInputElement)?.files?.[0] || null);
};


</script>