<script setup lang="ts">
import { ref } from "vue";
import type { ButtonProps } from "./types";

defineOptions({
  name: "VkButton",
});

withDefaults(defineProps<ButtonProps>(), {
  nativeType: "button",
});

const buttonRef = ref<HTMLButtonElement>();

defineExpose({
  ref: buttonRef,
});
</script>

<template>
  <button
    ref="buttonRef"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type,
      [`vk-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <span>
      <slot></slot>
    </span>
  </button>
</template>
