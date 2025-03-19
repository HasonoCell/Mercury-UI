<script setup lang="ts">
import type { AlertProps } from "./types";
import type { AlertEmits } from "./types";
import type { AlertInstance } from "./types";
import Icon from "../Icon/Icon.vue";
import { ref } from "vue";

const close = () => {
  isShow.value = false;
  emits("close");
};

const isShow = ref<boolean>(true);

defineOptions({
  name: "VkAlert",
});

defineProps<AlertProps>();

const emits = defineEmits<AlertEmits>();

defineExpose<AlertInstance>({
  close: close,
});
</script>

<template>
  <Transition name="fade">
    <div
      class="vk-alert"
      :class="{
        [`vk-alert--${type}`]: type,
        [`vk-alert--${effect}`]: effect,
      }"
      v-show="isShow"
    >
      <slot></slot>
      <div v-if="closable" @click="close" class="vk-alert-icon">
        <Icon icon="xmark"></Icon>
      </div>
    </div>
  </Transition>
</template>
