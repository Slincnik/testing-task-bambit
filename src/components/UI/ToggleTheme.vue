<template>
  <BaseButton
    class="text-white rounded-full"
    type="button"
    @click="toggleDark()"
    aria-label="Переключатель темы"
    :title="isDark ? 'Темная тема' : 'Светлая тема'"
  >
    {{ isDark ? "🌙" : "☀️" }}
  </BaseButton>
</template>

<script setup>
import BaseButton from "./BaseButton.vue";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
