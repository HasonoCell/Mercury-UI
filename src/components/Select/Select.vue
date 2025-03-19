<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { SelectEmits, SelectOption, SelectProps, SelectStates } from "./types";
import Tooltip from "../Tooltip/Tooltip.vue";
import type { TooltipInstance } from "../Tooltip/types";
import Input from "../Input/Input.vue";
import { computed, reactive, ref, type Ref, watch } from "vue";
import type { InputInstance } from "../Input/types";
import Icon from "../Icon/Icon.vue";
import RenderVnode from "../Common/RenderVnode";
import { isFunction, debounce } from "lodash-es";

// 组件基础声明
defineOptions({
  name: "VkSelect",
});
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
});
const emits = defineEmits<SelectEmits>();

// 组件引用声明
const tooltipRef = ref() as Ref<TooltipInstance>;
const inputRef = ref() as Ref<InputInstance>;

// 响应式状态
const isDropdownShow = ref(false);

const filteredOptions = ref(props.options);
const findOption = (value: string | number) => {
  const option = props.options.find((option) => option.value === value);
  return option ? option : null;
};

const initialOption = findOption(props.modelValue);

const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : "",
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1,
});

// 计算属性
const showClearIcon = computed(
  () =>
    props.clearable && states.mouseHover && states.selectedOption && states.inputValue.trim() !== ""
);

const timeout = computed(() => (props.remote ? 300 : 0));

const filteredPlaceholder = computed(() => {
  return props.filterable && states.selectedOption && isDropdownShow.value
    ? states.selectedOption.label
    : props.placeholder;
});

// 下拉控制
const controlDropdown = (show: boolean) => {
  if (show) {
    // filter 模式且之前选择过
    if (props.filterable && states.selectedOption) {
      states.inputValue = "";
    }
    if (props.filterable) {
      // 进行一次默认选项的生成
      generateFilterOptions(states.inputValue);
    }
    tooltipRef.value.show();
  } else {
    // blur 时将之前选择的值回灌
    tooltipRef.value.hide();
    if (props.filterable) {
      states.inputValue = states.selectedOption ? states.selectedOption.label : "";
    }
    states.highlightIndex = -1;
  }
  isDropdownShow.value = show;
  emits("visible-change", show);
};

const toggleDropdown = () => {
  if (props.disabled) return;
  if (isDropdownShow.value) {
    controlDropdown(false);
  } else {
    controlDropdown(true);
  }
};

// 选项操作
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return;
  states.inputValue = e.label;
  states.selectedOption = e;
  emits("update:modelValue", e.value as string);
  emits("change", e.value as string);
  controlDropdown(false);
  inputRef.value.ref.focus();
};

const handleClear = () => {
  states.selectedOption = null;
  states.inputValue = "";
  emits("clear");
  emits("change", "");
  emits("update:modelValue", "");
};

// 过滤功能
const generateFilterOptions = async (searchVal: string) => {
  if (!props.filterable) return;
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchVal);
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true;
    try {
      filteredOptions.value = await props.remoteMethod(searchVal);
    } catch (error) {
      console.log(error);
      filteredOptions.value = [];
    } finally {
      states.loading = false;
    }
  } else {
    filteredOptions.value = props.options.filter((option) => option.label.includes(searchVal));
  }
  states.highlightIndex = -1;
};

const handleFilter = () => {
  generateFilterOptions(states.inputValue);
};

const debounceOnFilter = debounce(() => {
  handleFilter();
}, timeout.value);

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "Enter":
      if (!isDropdownShow.value) {
        controlDropdown(true);
      } else {
        if (states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]) {
          itemSelect(filteredOptions.value[states.highlightIndex]);
        } else {
          controlDropdown(false);
        }
      }
      break;

    case "Escape":
      if (isDropdownShow.value) {
        controlDropdown(false);
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filteredOptions.value.length - 1;
        } else {
          states.highlightIndex--;
        }
      }
      break;

    case "ArrowDown":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        if (
          states.highlightIndex === -1 ||
          states.highlightIndex === filteredOptions.value.length - 1
        ) {
          states.highlightIndex = 0;
        } else {
          states.highlightIndex++;
        }
      }
      break;
  }
};

const popperOptions: any = {
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 9],
      },
    },
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
    },
  ],
};

// 数据监听
watch(
  () => props.options,
  (newVal) => {
    filteredOptions.value = newVal;
  }
);

const NOOP = () => {};
</script>

<template>
  <div
    class="vk-select"
    :class="{
      'is-disabled': disabled,
    }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <Tooltip
      placement="bottom-start"
      manual
      ref="tooltipRef"
      :popper-options="popperOptions"
      @click-outside="controlDropdown(false)"
    >
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filteredPlaceholder"
        ref="inputRef"
        :readonly="!filterable || !isDropdownShow"
        @input="debounceOnFilter"
        @keydown="handleKeydown"
      >
        <template #suffix>
          <Icon
            icon="circle-xmark"
            v-if="showClearIcon"
            class="vk-input__clear"
            @mousedown.prevent="NOOP"
            @click.stop="handleClear"
          />
          <Icon
            icon="angle-down"
            v-else
            class="header-angle"
            :class="{
              'is-active': isDropdownShow,
            }"
          />
        </template>
      </Input>
      <template #content>
        <div class="vk-select__loading" v-if="states.loading"><Icon icon="spinner" spin /></div>
        <div class="vk-select__nodata" v-else-if="filterable && filteredOptions.length === 0">
          No Matching Data
        </div>
        <ul class="vk-select__menu" v-else>
          <template v-for="(item, index) in filteredOptions" :key="index">
            <li
              class="vk-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlighted': states.highlightIndex === index,
              }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)"
            >
              <!-- 防止冒泡 -->
              <RenderVnode :vnode="renderLabel ? renderLabel(item) : item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
