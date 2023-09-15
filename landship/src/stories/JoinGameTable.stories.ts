import type { Meta, StoryObj } from '@storybook/react';

import { JoinGameTable } from '../components/JoinGameTable';

const meta = {
  title: 'Menus/JoinGameTable',
  component: JoinGameTable,
  parameters: {},
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EmptyTable: Story = {
  args: {
    gameList: [],
  },
};

export const OneItem: Story = {
    args: {
      gameList: [{
        id: 1,
        game: {
            name: 'Test Game',
            comment: 'This is a test game',
            state: 'Join',
        }
      }],
    },
  };

