<template>
    <div v-if="props.show" id="toast-simple" class="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
      <span class="material-symbols-outlined">
        notifications
      </span>
      <div class="ps-4 text-sm font-normal">{{ props.message }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
    import {watchEffect } from 'vue'

    interface Props {
        message: string
        show: boolean
    }

    const props = defineProps<Props>()

    watchEffect(async () => {
    if (props.message) {
      console.log(props.message)
    }
    
    })


  </script>