import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import * as Select from "src/stories/Select/Select";
import ArrowDownSmallIcon from "src/components/Icon/ArrowDownSmallIcon";

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  args: {},
  render: () => {
    return (
      <Select.Root defaultValue="model3">
        <Select.Trigger>
          <Select.Value />
          <ArrowDownSmallIcon />
        </Select.Trigger>
        <Select.Content>
          <Select.Option value="model3">model3</Select.Option>
          <Select.Option value="modelY">modelY</Select.Option>
        </Select.Content>
      </Select.Root>
    );
  },
};
