import type { StoryObj } from "@storybook/react";
import Joypad from "./Joypad";

const meta = {
  title: "Controls/Joypad",
  component: Joypad,
  parameters: {},
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EmptyTable: Story = {
  args: {},
};
