<template>
  <thead role="rowgroup" class="sticky top-0 bg-gray-200 dark:bg-gray-800">
    <tr role="row">
      <th
        v-for="col in columns"
        :key="col.key"
        role="columnheader"
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
        @click="col.sorted && emits('sorting', col.key)"
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
const emits = defineEmits("sorting");
</script>
