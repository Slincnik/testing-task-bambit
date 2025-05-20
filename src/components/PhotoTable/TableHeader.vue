<template>
  <thead role="rowgroup" class="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10">
    <tr role="row">
      <th
        v-for="col in columns"
        :key="col.key"
        role="columnheader"
        :aria-sort="
          sortKey === col.key
            ? sortOrder === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
        "
        :title="col.label"
        @click="emits('bySort', col.key)"
        :class="[
          'p-2 truncate whitespace-nowrap',
          'cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700',
        ]"
      >
        {{ col.label }}
        <span v-if="sortKey === col.key">
          {{ sortOrder === "asc" ? "↑" : "↓" }}</span
        >
      </th>
    </tr>
  </thead>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  sortKey: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: String,
    default: "asc",
  },
});
const emits = defineEmits("bySort");
</script>
