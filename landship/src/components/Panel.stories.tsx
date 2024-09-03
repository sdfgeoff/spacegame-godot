import type { StoryObj } from "@storybook/react";

import Panel, { ExtraBorder, PanelVariants } from "./Panel";

const meta = {
  title: "Components/Panel",
  component: Panel,
  parameters: {},
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      options: PanelVariants,
      control: { type: "select" },
    },
    extraBorder: {
      options: ExtraBorder,
      control: { type: "select" },
    },
    children: {
      type: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EmptyTable: Story = {
  args: {
    variant: "light",
    children: "This is some test text",
  },
};
