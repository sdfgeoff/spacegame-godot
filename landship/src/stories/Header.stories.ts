import type { Meta, StoryObj } from '@storybook/react';

import { Header } from '../components/Header';

const meta = {
  title: 'Screen/Header',
  component: Header,
  parameters: {},
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
    trackerState: 'error',
    gameMode: {
        mode: 'home',
    }
  },
};

export const Hosting: Story = {
    args: {
      trackerState: 'connected',
        gameMode: {
            mode: 'host',
            gameData: {
                name: 'Test Game',
                comment: 'This is a test game',
                state: 'Join',
            }
        }
    },
  };

