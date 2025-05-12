<template>
  <div
    class="max-h-[600px] w-[600px] overflow-y-auto border mx-auto relative border-gray-200 dark:border-gray-700 rounded shadow"
    @scroll="handleScroll"
  >
    <table class="w-full table-fixed border-collapse">
      <colgroup>
        <col v-for="col in columns" :key="col.key" class="w-1/5" />
      </colgroup>
      <thead class="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :aria-sort="
              col.sorted
                ? sortKey === col.key
                  ? sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                : 'none'
            "
            :title="col.label"
            @click="col.sorted && handleSort(col.key)"
            :class="[
              'p-2 truncate whitespace-nowrap',
              col.sorted
                ? 'cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700'
                : 'cursor-default',
            ]"
          >
            {{ col.label }}
            <span v-if="sortKey === col.key">
              {{ sortOrder === "asc" ? "↑" : "↓" }}</span
            >
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="loading && !photos.length">
          <tr v-for="n in Math.floor(perPage / 2.2)" :key="'initial-skel-' + n">
            <td v-for="col in columns" :key="col.key" class="p-2">
              <div
                class="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="photo in photos" :key="photo.id">
            <td
              v-for="col in columns"
              :key="col.key"
              class="p-1 whitespace-nowrap max-w-[1px] truncate overflow-hidden"
              :title="String(photo[col.key])"
            >
              {{ photo[col.key] }}
            </td>
          </tr>
          <tr v-if="loading && photos.length > 0">
            <td :colspan="columns.length" class="text-center p-2">
              Загрузка...
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePhotoStore } from "../stores/photoStores.js";
import { storeToRefs } from "pinia";

const photoStore = usePhotoStore();
const { loading, perPage, photos, sortKey, sortOrder } =
  storeToRefs(photoStore);

const columns = [
  { key: "id", label: "ID", sorted: true },
  { key: "albumId", label: "Альбом", sorted: true },
  { key: "title", label: "Название", sorted: true },
  { key: "url", label: "Ссылка", sorted: false },
  { key: "thumbnailUrl", label: "Миниатюра", sorted: false },
];

const handleSort = (key) => {
  photoStore.sortPhotos(key);
};

const handleScroll = (event) => {
  const container = event.target;
  if (
    !loading.value &&
    container.scrollHeight - container.scrollTop <= container.clientHeight + 10
  ) {
    photoStore.loadMore();
  }
};

onMounted(() => {
  photoStore.fetchPhotos();
});
</script>
