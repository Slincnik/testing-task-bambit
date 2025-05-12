<template>
  <input
    :type
    :placeholder
    :name
    :disabled="loading"
    v-model="model"
    :title="placeholder"
    :aria-placeholder="placeholder"
    :aria-label="name"
    :aria-describedby="placeholder"
    class="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 transition-all truncate disabled:opacity-60 disabled:cursor-not-allowed"
  />
</template>

<script setup>
const model = defineModel();

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
</script>
