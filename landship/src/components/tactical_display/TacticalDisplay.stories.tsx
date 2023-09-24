import type {  StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/client-api'
import TacticalDisplay, { DisplayItem, TacticalDisplayProps } from './TacticalDisplay';


const meta = {
  title: 'Components/TacticalDisplay',
  component: TacticalDisplay,
  parameters: {},
  tags: ['autodocs'],
  args: {
    style: {
        type: 'object'
    },
    displayItems: {
        type: 'array'
    },
    setSeleted: {
        type: 'function'
    },
    selected: {
        type: 'object'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const ITEMS: DisplayItem[] = [
  {
    position: [0,0,0],
    id: '1'
  },
  {
    position: [1,1,1],
    id: '2'
  }
  ,
  {
    position: [1,-1,1],
    id: '3'
  }
]

const Template = (args: TacticalDisplayProps) => {
  const [{ setSelected, selected }, updateArgs] = useArgs();
  const handleSetSelected = (e: DisplayItem) => updateArgs({ selected: e });
  return <TacticalDisplay {...args} setSelected={handleSetSelected} selected={selected} />;
}

export const EmptyDisplay: Story = {
  render: Template,
  args: {
    style:{
        width: '30em',
        height: '30em'
    },
    displayItems: ITEMS,
    setSelected: (item: any) => console.log(item),
    selected: ITEMS[0]
  },
};

