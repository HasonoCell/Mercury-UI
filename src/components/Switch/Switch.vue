<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { SwitchEmits, SwitchProps } from "./types";

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});

const emits = defineEmits<SwitchEmits>();

const innerValue = ref(props.modelValue);

const input = ref<HTMLInputElement>();

const checked = computed(() => innerValue.value === props.activeValue);

const switchValue = () => {
  if (props.disabled) return;
  const newValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newValue;
  emits("change", newValue);
  emits("update:modelValue", newValue);
};

onMounted(() => {
  input.value!.checked = checked.value;
});

watch(checked, (newVal) => {
  input.value!.checked = newVal;
});

watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal;
  }
);

defineOptions({
  name: "VkSwitch",
  inheritAttrs: false,
});
</script>

<template>
  <div
    class="vk-switch"
    :class="{
      [`vk-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked,
    }"
    @click="switchValue"
  >
    <input
      class="vk-switch__input"
      type="checkbox"
      role="switch"
      :name="name"
      :disabled="disabled"
      ref="input"
    />
    <div class="vk-switch__core">
      <div class="vk-switch__core-inner">
        <span v-if="activeText || inactiveText" class="vk-switch__core-inner-text">{{
          checked ? activeText : inactiveText
        }}</span>
      </div>
      <div class="vk-switch__core-action"></div>
    </div>
  </div>
</template>
