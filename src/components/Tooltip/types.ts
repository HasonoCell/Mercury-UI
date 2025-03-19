import type { Placement, Options } from "@popperjs/core";

export interface TooltipProps {
  trigger?: "hover" | "click";
  content?: string;
  manual?: boolean;
  placement?: Placement;
  popperOptions?: Partial<Options>;
  transition?: string;
  openDelay?: number;
  closeDelay?: number;
}

export interface TooltipEmits {
  (e: "visible-change", value: boolean): void;
  (e: "click-outside", value: boolean): void;
}

export interface TooltipInstance {
  show: () => void;
  hide: () => void;
}
