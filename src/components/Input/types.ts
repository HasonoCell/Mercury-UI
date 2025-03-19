export interface InputProps {
  type?: "text" | "textarea" | "password";
  size?: "small" | "large";
  modelValue?: string;
  clearable?: boolean;
  showPassword?: boolean;
  disabled?: boolean;
  placeholder?: string;
  readonly?: boolean;
  autocomplete?: string;
  autofocus?: boolean;
  form?: string;
}

export interface InputEmits {
  // change 事件指的是值有变化了，并且失去了 focus
  (e: "change", value: string): void;
  // input 事件指的是值有了变化就算
  (e: "input", value: string): void;
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: FocusEvent): void;
  (e: "clear"): void;
  (e: 'update:modelValue', value: string): void;
}

export interface InputInstance {
  ref: HTMLInputElement | HTMLTextAreaElement;
}
