<script setup>
import HeaderComponent from "./components/HeaderComponent.vue";
import DisplayBitrixData from "./components/DisplayBitrixDates.vue";
</script>

<template>
  <div class="flex flex-col h-full">
    <HeaderComponent />
    <main class="flex mx-auto py-4 justify-center">
      <DisplayBitrixData />
    </main>
  </div>
</template>

<style></style>

