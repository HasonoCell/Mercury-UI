import { type Ref, type InjectionKey } from "vue";
export type NameType = string | number;

export interface CollapseItemProps {
  name: NameType;
  title?: string;
  disabled?: boolean;
}

export interface CollapseContext {
  activeName: Ref<NameType[]>;
  handleItemClick: (name: NameType) => void;
}

export interface CollapseProps {
  modelValue: NameType[];
  accordion?: boolean;
}

export interface CollapseEmits {
  (e: "update:modelValue", values: NameType[]): void;
  (e: "change", values: NameType[]): void;
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol("collapseContextKey");
