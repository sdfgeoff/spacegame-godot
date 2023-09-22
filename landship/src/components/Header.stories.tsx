import type { StoryObj } from '@storybook/react';
import { Header } from './Header';
import { AppContextDecorator } from '../../.storybook/AppContextDecorator';



const meta = {
  title: 'Screen/Header',
  component: Header,
  parameters: {},
  decorators: [
    AppContextDecorator
  ],
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const TrackerError: Story = {
  args: {
  },
};

export const Hosting: Story = {
  args: {
  },
};


