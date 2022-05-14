import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AddItemForm from "./AddItemForm";
import { action } from "@storybook/addon-actions";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "TODOLIST/AddItemForm",
  component: AddItemForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addNewElementCallback: { description: "callback" },
  },
} as ComponentMeta<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddItemForm> = (args) => (
  <AddItemForm {...args} />
);

export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
  addNewElementCallback: action("addNewElementCallback"),
};
