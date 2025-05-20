<template>
  <button :disabled="loading" :class="btnClasses" type="button">
    <span v-if="loading" class="animate-spin">
      <LoaderCircle />
    </span>
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
import { LoaderCircle } from "lucide-vue-next";

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
    "px-3 py-2 rounded transition-colors shadow bg-gradient-to-r from-blue-500 to-purple-500",
    "min-h-[38px] transition-colors",
    props.loading
      ? "opacity-40 cursor-not-allowed"
      : "hover:from-blue-600 hover:to-purple-600 cursor-pointer",
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
