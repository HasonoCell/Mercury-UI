<script setup lang="ts">
import { ref, watch, reactive, onUnmounted, computed } from "vue";
import type { TooltipEmits, TooltipProps, TooltipInstance } from "./types";
import { createPopper, type Instance } from "@popperjs/core";
import useClickOutside from "../../hooks/useClickOutside";
import { debounce } from "lodash-es";

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  openDelay: 0,
  closeDelay: 0,
});

const emits = defineEmits<TooltipEmits>();

const isOpen = ref(false);

const popperContainerNode = ref<HTMLElement>();

const popperNode = ref<HTMLElement>();

const triggerNode = ref<HTMLElement>();

let popperInstance: null | Instance = null;

const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 9],
        },
      },
    ],
    ...props.popperOptions,
  };
});

const open = () => {
  isOpen.value = true;
  emits("visible-change", true);
};

const close = () => {
  isOpen.value = false;
  emits("visible-change", false);
};

const openDebounce = debounce(open, props.openDelay);

const openFinal = () => {
  closeDebounce.cancel();
  openDebounce();
};

const closeDebounce = debounce(close, props.closeDelay);

const closeFinal = () => {
  openDebounce.cancel();
  closeDebounce();
  console.log("close");
};

const togglePopper = () => {
  if (isOpen.value) {
    closeFinal();
  } else {
    openFinal();
  }
};

let events: Record<string, unknown> = reactive({});

let outerEvents: Record<string, unknown> = reactive({});

if (!props.manual) {
  useClickOutside(popperContainerNode, () => {
    if (props.trigger === "click" && isOpen.value) {
      close();
    }
  });
}

const attachEvents = () => {
  if (props.trigger === "click") {
    events["click"] = togglePopper;
  } else {
    events["mouseenter"] = openFinal;
    outerEvents["mouseleave"] = closeFinal;
  }
};

if (!props.manual) {
  attachEvents();
}

watch(
  isOpen,
  (newVal) => {
    if (newVal) {
      if (triggerNode.value && popperNode.value) {
        popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value);
      } else {
        popperInstance?.destroy();
      }
    }
  },
  { flush: "post" }
);

watch(
  () => props.manual,
  (isManual) => {
    if (isManual) {
      events = {};
      outerEvents = {};
    } else {
      attachEvents();
    }
  }
);

watch(
  () => props.trigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      events = {};
      outerEvents = {};
      attachEvents();
    }
  }
);

defineExpose<TooltipInstance>({
  show: openFinal,
  hide: closeFinal,
});

defineOptions({
  name: "VkTooltip",
});

onUnmounted(() => {
  popperInstance?.destroy();
});
</script>

<template>
  <div class="vk-tooltip" ref="popperContainerNode" v-on="outerEvents">
    <div class="vk-tooltip__trigger" ref="triggerNode" v-on="events">
      <slot></slot>
    </div>
    <Transition :name="transition">
      <div class="vk-tooltip__popper" ref="popperNode" v-if="isOpen">
        <slot name="content">{{ content }}</slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </Transition>
  </div>
</template>
