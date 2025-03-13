import { beforeAll, describe, test, vi, expect } from "vitest";
import { mount } from "@vue/test-utils";
import type { VueWrapper, DOMWrapper } from "@vue/test-utils";
import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";

const onChange = vi.fn();

let wrapper: VueWrapper;
let headrs: DOMWrapper<Element>[];
let contents: DOMWrapper<Element>[];
let firstHeader: DOMWrapper<Element>;
let secondHeader: DOMWrapper<Element>;
let firstContent: DOMWrapper<Element>;
let secondContent: DOMWrapper<Element>;
let disabledHeader: DOMWrapper<Element>;
let disabledContent: DOMWrapper<Element>;

describe("Collapse.vue", () => {
  beforeAll(() => {
    wrapper = mount(
      () => (
        <Collapse modelValue={["a"]} onChange={onChange}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ["Icon"],
        },
        attachTo: document.body, // 处理 jmdom bug 问题
      }
    );
    headrs = wrapper.findAll(".vk-collapse-item__header");
    contents = wrapper.findAll(".vk-collapse-item__wrapper");
    firstHeader = headrs[0];
    secondHeader = headrs[1];
    firstContent = contents[0];
    secondContent = contents[1];
    disabledHeader = headrs[2];
    disabledContent = contents[2];
  });
  test("测试基础结构以及对应文本", () => {
    // 长度
    expect(headrs.length).toBe(3);
    expect(contents.length).toBe(3);

    // 标题
    expect(firstHeader.text()).toBe("title a");

    // 内容
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).not.toBeTruthy();
  });

  test("点击标题展开，关闭内容", async () => {
    // 点击行为
    await firstHeader.trigger("click"); // 添加 await
    expect(firstContent.isVisible()).not.toBeTruthy();
    await secondHeader.trigger("click");
    expect(secondContent.isVisible()).toBeTruthy();
  });

  test("发送正确的事件", () => {
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(["b"]);
  });

  test("disabled 的内容没有反应", async () => {
    // disabled
    onChange.mockClear(); // 重置之前对 onChange 方法的调用
    expect(disabledHeader.classes()).toContain("is-disabled");
    await disabledHeader.trigger("click");
    expect(disabledContent.isVisible()).toBeFalsy();
    expect(onChange).not.toHaveBeenCalled();
  });
});
