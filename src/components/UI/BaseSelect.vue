<template>
  <div class="relative" ref="dropdownRef">
    <div
      class="flex flex-nowrap w-[200px] items-center px-3 py-2 rounded-xl border transition-all cursor-pointer min-h-[38px]"
      @click="toggleDropdown"
      tabindex="0"
      @keydown.enter.prevent="toggleDropdown"
    >
      <div class="truncate flex-grow">
        <span
          v-if="modelValue.length === 0"
          class="select-none whitespace-nowrap"
        >
          {{ placeholder }}
        </span>
        <span v-else class="font-semibold">
          Выбрано: {{ modelValue.length }}
        </span>
      </div>
      <div class="flex items-center">
        <span
          :class="[
            'transition-transform duration-200 inline-block',
            { '-rotate-180': isOpen },
          ]"
        >
          <ChevronDown size="18" />
        </span>
      </div>
    </div>
    <div
      v-if="isOpen"
      class="absolute z-20 mt-1 box-content w-full bg-white dark:bg-black border rounded-xl shadow-lg max-h-60 overflow-auto"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="px-3 py-2 truncate hover:bg-blue-50 dark:hover:bg-gray-800 flex items-center cursor-pointer"
        @click.stop="toggleOption(option.value)"
        @keydown.enter.prevent="toggleOption(option.value)"
        :title="option.label"
      >
        <input
          type="checkbox"
          class="mr-2"
          :checked="modelValue.includes(option.value)"
          @change.stop="toggleOption(option.value)"
        />
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useTemplateRef } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";

const modelValue = defineModel();

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Выберите...",
  },
});

const isOpen = ref(false);
const dropdownRef = useTemplateRef("dropdownRef");

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

function toggleDropdown() {
  if (props.loading) return;
  isOpen.value = !isOpen.value;
}

function toggleOption(value) {
  const idx = modelValue.value.indexOf(value);
  if (idx === -1) {
    modelValue.value = [...modelValue.value, value];
  } else {
    modelValue.value = modelValue.value.filter((v) => v !== value);
  }
}

const selectedLabels = computed(() =>
  Array.isArray(props.options)
    ? props.options
        .filter((opt) => modelValue.value.includes(opt.value))
        .map((opt) => opt.label)
    : []
);

// Новые вычисляемые свойства для вывода максимум 2 элементов
const displayedLabels = computed(() => selectedLabels.value.slice(0, 2));
const restCount = computed(() => Math.max(0, selectedLabels.value.length - 2));
</script>
