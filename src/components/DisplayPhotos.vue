<template>
  <div
    class="max-h-[600px] w-[600px] overflow-y-auto border mx-auto relative border-gray-200 dark:border-gray-700 rounded shadow"
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
import { computed, nextTick, onMounted, useTemplateRef } from "vue";
import { usePhotoStore } from "../stores/photoStores.js";
import { storeToRefs } from "pinia";
import TableHeader from "./PhotoTable/TableHeader.vue";
import TableBody from "./PhotoTable/TableBody.vue";

const photoStore = usePhotoStore();
const { loading, perPage, photos, sortKey, sortOrder, hasMore } =
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
    console.log(scrollContainer.value);
    scrollContainer.value.scrollTo({ top: 0, behavior: "smooth" });
  });
};

const checkScroll = computed(() => !loading.value && hasMore.value);

const handleScroll = () => {
  const container = scrollContainer.value;
  if (
    checkScroll.value &&
    container.scrollHeight - container.scrollTop <= container.clientHeight + 10
  ) {
    photoStore.loadMore();
  }
};

onMounted(() => {
  photoStore.fetchPhotos();
});
</script>
