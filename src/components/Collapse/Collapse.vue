<script setup lang="ts">
import type { NameType, CollapseEmits, CollapseProps } from "./types";
import { ref, provide, watch } from "vue";
import { collapseContextKey } from "./types";

defineOptions({
  name: "VkCollapse",
});

const props = defineProps<CollapseProps>();

const emits = defineEmits<CollapseEmits>();

const activeName = ref<NameType[]>(props.modelValue);

const handleItemClick = (item: NameType) => {
  const index = activeName.value.indexOf(item);
  if (props.accordion) {
    activeName.value = [activeName.value[0] === item ? "" : item];
  } else {
    if (index >= 0) {
      // 存在，删除对应项
      activeName.value.splice(index, 1);
    } else {
      // 不存在，添加对应项
      activeName.value.push(item);
    }
  }
  emits("update:modelValue", activeName.value);
  emits("change", activeName.value);
};

provide(collapseContextKey, {
  activeName,
  handleItemClick,
});

watch(() => props.modelValue, () => {
  activeName.value = props.modelValue
})
</script>

<template>
  <div class="vk-collapse">
    <slot></slot>
  </div>
</template>
