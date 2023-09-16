import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "src/stories/Select/Select";

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  args: {
    renderButton: Select.DefaultSelect,
  },
  // render: () => {
  //   return <Temp />;
  // },
};
