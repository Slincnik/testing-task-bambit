<template>
  <button :disabled="loading" :class="btnClasses" type="button">
    <span v-if="loading" class="animate-spin loader"></span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
  },
});

const btnClasses = computed(() => {
  return [
    "px-4 py-3 rounded transition-colors self-center shadow block",
    props.loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600",
  ];
});
</script>

<style scoped>
.loader {
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
