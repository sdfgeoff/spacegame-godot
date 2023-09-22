import type { StoryObj } from '@storybook/react';

import { ExtraBorder, PanelVariants } from './Panel';
import PanelTitled from './PanelTitled';

const meta = {
    title: 'Components/PanelTitled',
    component: PanelTitled,
    parameters: {},
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        'variant': {
            options: PanelVariants,
            control: { type: 'select' }
        },
        'extraBorder': {
            options: ExtraBorder,
            control: { type: 'select' }
        },
        'children': {
            type: 'text',
        },
        'heading': {
            type: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EmptyTable: Story = {
    args: {
        variant: 'light',
        heading: 'This is a test title',
        children: 'This is some test text',
    },
};
