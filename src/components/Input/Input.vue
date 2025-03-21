<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch } from "vue";
import type { InputEmits, InputProps } from "./types";
import type { Ref } from "vue";
import Icon from "../Icon/Icon.vue";
import { nextTick } from "vue";
import { formItemContextKey } from "../Form/types";

defineOptions({
  name: "VkInput",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  autocomplete: "off",
  modelValue: "",
});

const emits = defineEmits<InputEmits>();

const attrs = useAttrs();

const innerValue = ref<string>(props.modelValue);

const isFocus = ref(false);

const passwordVisible = ref(false);

const inputRef = ref() as Ref<HTMLElement>;

const formItemContext = inject(formItemContextKey, undefined);

const runValidation = (trigger?: string) => {
  formItemContext?.validate?.(trigger).catch((e) => console.log(e.errors));
};

const showClear = computed(
  () => props.clearable && !props.disabled && !!innerValue.value && isFocus.value
);

const showPasswordArea = computed(
  () => props.showPassword && !props.disabled && !!innerValue.value
);

const handleInput = () => {
  emits("update:modelValue", innerValue.value);
  emits("input", innerValue.value);
  runValidation("input");
};

const handleChange = () => {
  emits("change", innerValue.value);
  runValidation("change");
};

const handleFocus = (event: FocusEvent) => {
  isFocus.value = true;
  emits("focus", event);
};

const keepFocus = async () => {
  await nextTick();
  inputRef.value.focus();
};

const handleBlur = (event: FocusEvent) => {
  isFocus.value = true;
  emits("blur", event);
  runValidation("blur");
};

const clear = () => {
  innerValue.value = "";
  emits("update:modelValue", "");
  emits("clear");
  emits("input", "");
  emits("change", "");
};

const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
};

// 占位函数，消除 blur 带来的影响
const NOOP = () => {};

watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal;
  }
);

defineExpose({
  ref: inputRef,
});
</script>

<template>
  <div
    class="vk-input"
    :class="{
      [`vk-input--${type}`]: type,
      [`vk-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus,
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="vk-input__prepend">
        <slot name="prepend" />
      </div>
      <div class="vk-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="vk-input__prefix">
          <slot name="prefix" />
        </span>
        <!-- main input -->
        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          v-bind="attrs"
          class="vk-input__inner"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          ref="inputRef"
        />
        <!-- suffix slot -->
        <span
          v-if="$slots.suffix || showClear || showPasswordArea"
          class="vk-input__suffix"
          @click="keepFocus"
        >
          <slot name="suffix" />
          <Icon
            icon="circle-xmark"
            v-if="showClear"
            class="vk-input__clear"
            @click="clear"
            @mousedown.prevent="NOOP"
          />
          <Icon
            icon="eye"
            v-if="showPasswordArea && passwordVisible"
            class="vk-input__password"
            @click="togglePasswordVisible"
          />
          <Icon
            icon="eye-slash"
            v-if="showPasswordArea && !passwordVisible"
            class="vk-input__password"
            @click="togglePasswordVisible"
          />
        </span>
      </div>
      <!-- append slot -->
      <div v-if="$slots.append" class="vk-input__append">
        <slot name="append" />
      </div>
    </template>

    <!-- textarea -->
    <template v-else>
      <textarea
        v-bind="attrs"
        class="vk-textarea__wrapper"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        ref="inputRef"
      ></textarea>
    </template>
  </div>
</template>
