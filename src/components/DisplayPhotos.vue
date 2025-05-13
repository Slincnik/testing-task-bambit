<template>
  <div
    class="w-full max-w-[600px] max-h-[600px] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch border mx-auto border-gray-200 dark:border-gray-700 rounded shadow"
    @scroll="handleScroll"
    ref="scrollContainer"
  >
    <table class="w-full table-fixed border-collapse">
      <colgroup>
        <col v-for="col in columns" :key="col.key" class="w-1/5" />
      </colgroup>
      <TableHeader :columns :sortKey :sortOrder @sorting="sortBy" />

      <TableBody :columns :photos :loading :skeleton-count="skeletonCount" />
    </table>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, useTemplateRef, watch } from "vue";
import { usePhotoStore } from "../stores/photoStores.js";
import { storeToRefs } from "pinia";
import TableHeader from "./PhotoTable/TableHeader.vue";
import TableBody from "./PhotoTable/TableBody.vue";
import { useDebounceFn } from "@vueuse/core";

const photoStore = usePhotoStore();
const { loading, perPage, photos, sortKey, sortOrder, hasMore, albumIds } =
  storeToRefs(photoStore);

const scrollContainer = useTemplateRef("scrollContainer");

const columns = computed(() => [
  { key: "id", label: "ID", sorted: true },
  { key: "albumId", label: "Альбом", sorted: true },
  { key: "title", label: "Название", sorted: true },
  { key: "url", label: "Ссылка", sorted: false },
  { key: "thumbnailUrl", label: "Миниатюра", sorted: false },
]);

const skeletonCount = computed(() => Math.floor(perPage.value / 2));

const sortBy = (key) => {
  photoStore.sortPhotos(key);
  nextTick(() => {
    scrollContainer.value.scrollTo({ top: 0, behavior: "smooth" });
  });
};

// При смене альбома скроллим в самый вверх
watch(albumIds, () => {
  scrollContainer.value.scrollTo({ top: 0, behavior: "smooth" });
});

// При смене сортировки скроллим в самый вверх
watch(sortKey, () => {
  scrollContainer.value.scrollTo({ top: 0, behavior: "smooth" });
});

// Если данных нету, проверяем нужно ли загружать
const checkScroll = computed(() => !loading.value && hasMore.value);

// При скролле проверяем нужно ли загружать данные
const handleScroll = useDebounceFn(() => {
  const container = scrollContainer.value;
  if (
    checkScroll.value &&
    container.scrollHeight - container.scrollTop <= container.clientHeight + 10
  ) {
    photoStore.loadMore();
  }
}, 150);

onMounted(() => {
  photoStore.fetchPhotos();
});
</script>
