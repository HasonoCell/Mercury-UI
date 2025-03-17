import { h, render, shallowReactive } from "vue";
import MessageConstructor from "./Message.vue";
import type { CreateMessageProps, MessageContext } from "./types";
import useZIndex from "@/hooks/useZIndex";

let seed = 1;

const instances: MessageContext[] = shallowReactive([]);
export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex()

  const id = `message ${seed++}`;

  const container = document.createElement("div");

  const destory = () => {
    // 删除数组中的示例
    const idx = instances.findIndex((instance) => instance.id === id);
    if (idx === -1) return;
    instances.splice(idx, 1);
    render(null, container);
  };

  // 手动调用删除，调整组件中 visible 的值
  const manualDestory = () => {
    const instance = instances.find((instance) => instance.id === id);
    if (instance) {
      instance.vm.exposed!.visible.value = false;
    }
  };

  const newProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestory: destory,
  };

  const vnode = h(MessageConstructor, newProps);

  render(vnode, container);

  // 采用非空断言运算符
  document.body.appendChild(container.firstChild!);

  const vm = vnode.component!;

  const instance = {
    id,
    vnode,
    vm,
    props: newProps,
    destory: manualDestory,
  };

  instances.push(instance);
  return instance;
};

export const getLastInstance = () => {
  return instances.at(-1);
};

export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex((instance) => instance.id === id);
  if (idx <= 0) {
    return 0;
  } else {
    const prev = instances[idx - 1];
    return prev.vm.exposed!.bottomOffset.value;
  }
};
