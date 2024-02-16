<script setup lang="ts">
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue';
import LoginRegister from '@/views/LoginRegisterView.vue';

const route = useRoute()  
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center" v-if="route.name === 'loginandregister'" >
    <LoginRegister />
  </div>
  <div class="w-screen h-screen" v-if="route.name !== 'loginandregister'" >
    <Sidebar />
  </div>
</template>

<style scoped>

</style>
