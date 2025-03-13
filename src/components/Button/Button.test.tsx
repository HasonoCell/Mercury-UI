import { describe, test, expect } from "vitest";
import Button from "./Button.vue";
import { mount } from "@vue/test-utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Icon from "../Icon/Icon.vue";

describe("Button.vue", () => {
  test("basic button", () => {
    const wrapper = mount(Button, {
      props: {
        type: "primary",
      },
      slots: {
        default: "button",
      },
    });
    // 检测 type -> 确认是否存在相应类名
    expect(wrapper.classes()).toContain("vk-button--primary");

    // 检测 slots -> 确认内容展示是否有问题
    // 遍历所得到的 wrapper 的两种方法：get 和 find
    expect(wrapper.get("button").text()).toBe("button");

    // 检测 events
    wrapper.get("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });

  test("disabled", () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
      slots: {
        default: "disabled",
      },
    });
    // 使用 attributes 获取属性 方法一
    expect(wrapper.attributes("disabled")).toBeDefined();

    // 使用 attributes 获取属性 方法二（获取真实 DOM 节点）
    expect(wrapper.find("button").element.disabled).toBeDefined();

    wrapper.get("button").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("click");
  });

  // 处理第三方组件库
  test("icon", () => {
    const wrapper = mount(Button, {
      props: {
        icon: "arrow-up",
      },
      slots: {
        default: "icon",
      },
      global: {
        stubs: ["FontAwesomeIcon"],
      },
    });
    const iconElement = wrapper.findComponent(FontAwesomeIcon);
    expect(iconElement.exists()).toBeTruthy();
    expect(iconElement.attributes("icon")).toBe("arrow-up");
  });

  test("loading", () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: "loading",
      },
      global: {
        stubs: ["Icon"],
      },
    });
    const iconElement = wrapper.findComponent(Icon);
    expect(iconElement.exists()).toBeTruthy();
    expect(iconElement.attributes("icon")).toBe("spinner");
    expect(wrapper.attributes("disabled")).toBeDefined();
  });
});