<template>
  <header
    class="p-4 border-b flex justify-around items-center border-gray-200 dark:border-gray-700"
  >
    <div class="flex space-x-2 items-center mr-2 md:mr-0">
      <span class="font-bold">Фильтр</span>
      <BaseInput
        type="number"
        name="ID от"
        v-model="dealStore.state.filter.idFrom"
        :loading="dealStore.state.loading"
        placeholder="ID от"
        min="2"
      />
      <BaseInput
        type="number"
        name="ID до"
        v-model="dealStore.state.filter.idTo"
        :loading="dealStore.state.loading"
        placeholder="ID до"
        min="2"
      />
      <BaseButton
        @click="handleSearch"
        type="button"
        :loading="dealStore.state.loading"
        class="text-white rounded-xl"
        :style="{ minWidth: '80px' }"
      >
        Поиск
      </BaseButton>
    </div>
    <ToggleTheme />
  </header>
</template>

<script setup>
import ToggleTheme from "./UI/ToggleTheme.vue";
import BaseButton from "./UI/BaseButton.vue";
import BaseInput from "./UI/BaseInput.vue";
import { useDealStore } from "../stores/dealStores.js";

const dealStore = useDealStore();


function handleSearch() {
  dealStore.setFilter({
    idFrom: dealStore.state.filter.idFrom,
    idTo: dealStore.state.filter.idTo,
  });
  dealStore.fetchDeals(true);
}
</script>
