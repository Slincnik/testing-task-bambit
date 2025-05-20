<template>
  <BaseButton
    class="text-yellow-300 dark:text-gray-900 rounded-full"
    type="button"
    @click="toggleDark()"
    aria-label="Переключатель темы"
    :title="isDark ? 'Темная тема' : 'Светлая тема'"
    shrink
  >
    <component :is="currentTheme" />
  </BaseButton>
</template>

<script setup>
import { computed } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { Sun, Moon } from "lucide-vue-next";
import BaseButton from "./BaseButton.vue";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const currentTheme = computed(() => (isDark.value ? Moon : Sun));
</script>
