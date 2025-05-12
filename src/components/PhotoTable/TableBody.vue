<template>
  <tbody role="rowgroup">
    <template v-if="loading && !photos.length">
      <tr role="row" v-for="n in skeletonCount" :key="n">
        <td role="cell" v-for="col in columns" :key="col.key" class="p-2">
          <div
            aria-live="polite"
            class="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
          ></div>
        </td>
      </tr>
    </template>
    <template v-else>
      <tr role="row" v-for="photo in photos" :key="photo.id">
        <td
          role="cell"
          v-for="col in columns"
          :key="col.key"
          class="p-1 whitespace-nowrap truncate overflow-hidden"
          :title="String(photo[col.key])"
        >
          {{ photo[col.key] }}
        </td>
      </tr>
      <tr role="row" v-if="loading && photos.length > 0">
        <td role="cell" :colspan="columns.length" class="text-center p-2">
          Загрузка...
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  photos: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  skeletonCount: {
    type: Number,
    default: 0,
  },
});
</script>
