import { describe, expect, test, vi } from "vitest";
import Collapse from "./Collapse.vue";
import { mount } from "@vue/test-utils";
// import { h } from "vue";
import CollapseItem from "./CollapseItem.vue";

// describe("Collapse.vue", () => {
//   test("basic collapse", () => {
//     const wrapper = mount(Collapse, {
//       props: {
//         modelValue: ["a"],
//       },
//       slots: {
//         default: h(CollapseItem, { name: "a", title: "Title A" }, "content a"),
//         // 重要：通过渲染函数 h 生成虚拟 DOM
//       },
//       global: {
//         stubs: ["Icon"],
//       },
//     });
//     console.log(wrapper.html());
//   });
// });

// 第二种更为简洁的写法
describe("Collapse.vue", () => {
  test("basic collapse", async () => {
    const onChange = vi.fn()
    const wrapper = mount(
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
    const headrs = wrapper.findAll(".vk-collapse-item__header");
    const contents = wrapper.findAll(".vk-collapse-item__wrapper");

    // 长度
    expect(headrs.length).toBe(3);
    expect(contents.length).toBe(3);

    // 标题
    const firstHeader = headrs[0];
    const secondHeader = headrs[1];
    expect(firstHeader.text()).toBe("title a");

    // 内容
    const firstContent = contents[0];
    const secondContent = contents[1];
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).not.toBeTruthy();

    // 点击行为
    await firstHeader.trigger("click"); // 添加 await
    expect(firstContent.isVisible()).not.toBeTruthy();
    expect(onChange).toHaveBeenCalledWith([])
    await secondHeader.trigger("click");
    expect(secondContent.isVisible()).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith(['b'])

    // disabled
    const disabledHeader = headrs[2];
    const disabledContent = contents[2];
    expect(disabledHeader.classes()).toContain("is-disabled");
    await disabledHeader.trigger("click");
    expect(disabledContent.isVisible()).toBeFalsy();
  });
});
