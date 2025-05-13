<template>
  <button :disabled="loading" :class="btnClasses" type="button">
    <span v-if="loading" class="animate-spin loader"></span>
    <span
      v-else
      class="flex flex-col items-center justify-center text-center whitespace-normal break-words"
    >
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  shrink: {
    type: Boolean,
    default: false,
  },
});

const btnClasses = computed(() => {
  const base = [
    "inline-flex items-center justify-center",
    "px-3 py-2 rounded transition-colors shadow",
    "min-h-[38px]",
    props.loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600 cursor-pointer",
  ];

  // если shrink или loading — не накладываем min/max ширину
  if (!props.shrink && !props.loading) {
    base.push("min-w-[80px] max-w-[200px]");
  }

  return base;
});
</script>

<style scoped>
.loader {
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: inline-block;
}
</style>
