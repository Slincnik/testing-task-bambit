<script setup>
import HeaderComponent from "./components/HeaderComponent.vue";
import DisplayPhotos from "./components/DisplayPhotos.vue";
</script>

<template>
  <div class="flex flex-col h-full">
    <HeaderComponent />
    <main class="flex max-w-7xl mx-auto py-4 px-4 justify-center">
      <DisplayPhotos />
    </main>
  </div>
</template>

<style></style>

