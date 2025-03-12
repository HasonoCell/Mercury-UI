<script setup lang="ts">
import type { FontAwesomeIconProps } from "@fortawesome/vue-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";
import { computed } from "vue";

defineOptions({
  name: "VkIcon",
  inheritAttrs: false, // 与透传有关的知识点
});

// 这里对 FontAwesomeIconProps 参数列表要做出自定义调整
const props = defineProps<
  {
    type?: "primary" | "success" | "warning" | "danger" | "info";
    color?: string;
  } & FontAwesomeIconProps
>();

const filteredProps = computed(() => omit(props, ["type", "color"]));

const customStyles = computed(() => {
  return props.color ? { color: props.color } : {};
});
</script>

<template>
  <i
    class="vk-icon"
    :class="{
      [`vk-icon--${type}`]: type,
    }"
    :style="customStyles"
    v-bind="$attrs" 
  >
    <FontAwesomeIcon v-bind="filteredProps"></FontAwesomeIcon>
  </i>
</template>