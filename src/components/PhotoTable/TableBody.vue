<template>
  <tbody
    role="rowgroup"
    class="divide-y divide-gray-200 divide-x dark:divide-gray-700"
  >
    <template v-if="loading && !datas.length">
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
      <tr role="row" v-for="data in datas" :key="data.id">
        <td
          role="cell"
          v-for="col in columns"
          :key="col.key"
          class="p-1 whitespace-nowrap truncate overflow-hidden"
          :title="
            formatValue({
              data: data[col.key],
              ...col,
              categories: dealStore.state.categories,
              stages: dealStore.state.stages,
            })
          "
        >
          {{
            formatValue({
              data: data[col.key],
              ...col,
              categories: dealStore.state.categories,
              stages: dealStore.state.stages,
            })
          }}
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
import { useDealStore } from "../../stores/dealStores.js";
import formatValue from "../../utils/formatValue.js";

const dealStore = useDealStore();
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  datas: {
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
