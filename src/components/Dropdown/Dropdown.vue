<script setup lang="ts">
import { ref, type Ref } from "vue";
import type { DropdownEmits, DropdownInstance, DropdownProps, MenuOptions } from "./types";
import Tooltip from "../Tooltip/Tooltip.vue";
import type { TooltipInstance } from "../Tooltip/types";
import RenderVnode from "../Common/RenderVnode";

const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true,
});

const emits = defineEmits<DropdownEmits>();

const tooltipRef = ref() as Ref<TooltipInstance>;

defineExpose<DropdownInstance>({
  show: tooltipRef.value?.show,
  hide: tooltipRef.value?.hide,
});

const visibleChange = (e: boolean) => {
  emits("visible-change", e);
};

const itemClick = (e: MenuOptions) => {
  if (e.disabled) {
    return;
  }
  emits("select", e);
  if (props.hideAfterClick) {
    tooltipRef.value.hide();
  }
};

defineOptions({
  name: "VkDropdown"
})
</script>

<template>
  <div class="vk-dropdown">
    <Tooltip
      :trigger="trigger"
      :placement="placement"
      :popper-options="popperOptions"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      @visible-change="visibleChange"
      ref="tooltipRef"
    >
      <slot></slot>
      <template #content>
        <ul class="vk-dropdown__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li v-if="item.divided" role="separator" class="divided-placeholder"></li>
            <li
              class="vk-dropdown__item"
              @click="itemClick(item)"
              :class="{ 'is-disabled': item.disabled, 'is-divided': item.divided }"
              :id="`dropdown-item-${item.key}`"
            >
              <RenderVnode :vnode="item.label"></RenderVnode>
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
