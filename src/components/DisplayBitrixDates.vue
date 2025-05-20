<template>
  <div
    class="w-full max-w-full max-h-[600px] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch border mx-auto border-gray-200 dark:border-gray-700 rounded shadow"
    ref="scrollContainer"
  >
    <table class="w-full table-fixed border-collapse">
      <colgroup>
        <col v-for="col in columns" :key="col.key" />
      </colgroup>
      <TableHeader :columns :sortKey :sortOrder @bySort="dealStore.sortingBy" />
      <TableBody :columns :datas="sortedDeals" :loading :skeleton-count="10" />
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useDealStore } from "../stores/dealStores";
import { storeToRefs } from "pinia";
import TableHeader from "./PhotoTable/TableHeader.vue";
import TableBody from "./PhotoTable/TableBody.vue";

const dealStore = useDealStore();
const { deals, loading, fields, sortKey, sortOrder } = storeToRefs(dealStore);

const columns = computed(() =>
  Object.entries(fields.value).map(([key, meta]) => ({
    key,
    label: meta.title || key, // Вдруг не будет title
    ...meta,
  }))
);

// Сортировка, которая учитывает текущий ключ по которому сортируется
const sortedDeals = computed(() => {
  const col = columns.value.find((c) => c.key === sortKey.value);
  const type = col?.type;

  // Нет столбца - нет сортировки
  if (!col) return deals.value;

  return [...deals.value].sort((a, b) => {
    let va = a[sortKey.value]; // Первое значение
    let vb = b[sortKey.value]; // Второе значение

    if (type === "date") {
      if (!va && !vb) return 0;
      if (!va) return 1;
      if (!vb) return -1;

      const dateA = new Date(va);
      const dateB = new Date(vb);

      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;

      return sortOrder.value === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (type === "integer" || type === "double") {
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      const numA = Number(va);
      const numB = Number(vb);

      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;

      return sortOrder.value === "asc" ? numA - numB : numB - numA;
    }
    // Если строка может быть числом - возможно криво сравнивает ?
    return sortOrder.value === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });
});

onMounted(() => {
  dealStore.fetchAll(true);
});
</script>
