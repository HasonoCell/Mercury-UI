<script setup lang="ts">
import type { MessageProps } from "./types";
import RenderVnode from "../Common/RenderVnode";
import Icon from "../Icon/Icon.vue";
import { computed, onMounted, ref } from "vue";
import { getLastBottomOffset } from "./method";
import useEventListener from "@/hooks/useEventListener";

const props = withDefaults(defineProps<MessageProps>(), {
  duration: 3000,
  type: "info",
  offset: 20,
  transitionName: "fade-up",
});

const visible = ref(false);

const messageRef = ref<HTMLDivElement>();

// 计算偏移高度
// 这个 message div 的高度
const height = ref(0);

// 上一个 message 实例最下面的坐标数字，第一个是 0
const lastBottomOffset = computed(() => getLastBottomOffset(props.id));

// 这个元素应该使用的 top
const topOffseet = computed(() => props.offset + lastBottomOffset.value);

// 这个元素为下一个元素预留的 offset，也就是它最低端 bottom 的值
const bottomOffset = computed(() => height.value + topOffseet.value);

const cssStyle = computed(() => ({
  top: topOffseet.value + "px",
  zIndex: props.zIndex,
}));

let timer: number | null = null;

const startTimer = () => {
  if (props.duration === 0) return;
  timer = setTimeout(() => {
    visible.value = false;
  }, props.duration) as unknown as number; // 适配浏览器环境类型
};

const clearTimer = () => {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null; // 清理后重置避免内存泄漏
  }
};

useEventListener(document, "keydown", (e: Event) => {
  const event = e as KeyboardEvent;
  if (event.code === "Escape") {
    visible.value = false;
  }
});

onMounted(async () => {
  visible.value = true;
  startTimer();
});

defineExpose({
  bottomOffset,
  visible,
});

const destoryComponent = () => {
  props.onDestory();
};

const updateHeight = () => {
  height.value = messageRef.value!.getBoundingClientRect().height;
};
</script>

<template>
  <Transition :name="transitionName" @enter="updateHeight" @after-leave="destoryComponent">
    <div
      class="vk-message"
      :class="{
        [`vk-message--${type}`]: type,
        'is-close': showClose,
      }"
      role="alert"
      v-show="visible"
      ref="messageRef"
      :style="cssStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="vk-message__content">
        <slot>
          <!-- v-if 做类型收窄 -->
          <RenderVnode :vnode="message" v-if="message" />
        </slot>
      </div>
      <div class="vk-message__close" v-if="showClose">
        <Icon icon="xmark" @click.stop="visible = false" />
      </div>
    </div>
  </Transition>
</template>
