export const MAJOR_COLORS = [
  "light",
  "dark",
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
] as const;

export const COLOR_VARIANTS = [
  ...MAJOR_COLORS,
  "light_lightest",
  "light_lighter",
  "light_darker",
  "light_darkest",
  "dark_lightest",
  "dark_lighter",
  "dark_darker",
  "dark_darkest",
  "primary_lightest",
  "primary_lighter",
  "primary_darker",
  "primary_darkest",
  "secondary_lightest",
  "secondary_lighter",
  "secondary_darker",
  "secondary_darkest",
  "success_lightest",
  "success_lighter",
  "success_darker",
  "success_darkest",
  "info_lightest",
  "info_lighter",
  "info_darker",
  "info_darkest",
  "warning_lightest",
  "warning_lighter",
  "warning_darker",
  "warning_darkest",
  "danger_lightest",
  "danger_lighter",
  "danger_darker",
  "danger_darkest",
] as const;

export type MajorColor = (typeof MAJOR_COLORS)[number];
export type ColorVariant = (typeof COLOR_VARIANTS)[number];

export const colorToCSS = (variant: ColorVariant): string => {
  return `var(--c_${variant})`;
};
