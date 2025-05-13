<template>
  <header
    class="p-4 border-b flex justify-around items-center border-gray-200 dark:border-gray-700"
  >
    <div class="flex space-x-2 mr-2">
      <BaseInput
        type="text"
        name="Album Inputs"
        v-model="albumInput"
        :loading
        placeholder="Введите ID альбомов через пробелы"
      />
      <BaseButton
        @click="handleSearch"
        type="button"
        :loading
        class="text-white rounded-xl"
      >
        Поиск
      </BaseButton>
      <BaseButton
        @click="photoStore.resetSort"
        type="button"
        :loading
        title="Сброс сортировки"
        class="text-white rounded-xl"
      >
        Сброс
      </BaseButton>
    </div>
    <ToggleTheme />
  </header>
</template>

<script setup>
import ToggleTheme from "./UI/ToggleTheme.vue";
import BaseButton from "./UI/BaseButton.vue";
import BaseInput from "./UI/BaseInput.vue";
import { usePhotoStore } from "../stores/photoStores.js";

import { ref } from "vue";
import { storeToRefs } from "pinia";

const photoStore = usePhotoStore();
const { albumIds, loading } = storeToRefs(photoStore);

const albumInput = ref(albumIds.value.join(" "));

function handleSearch() {
  const ids = albumInput.value.trim().split(" ").filter(Boolean).map(Number);
  photoStore.setAlbumsIds(ids);
  photoStore.fetchPhotos(true);
  photoStore.resetSort();
}
</script>
