import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { action } from "@storybook/addon-actions";
import Task from "./Task";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatusType } from "../../../../api/todolist-api";
import { ReduxStoreProviderDecorator } from "../../../../utils/ReduxStoreProviderDecorator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "TODOLIST/Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = () => {
  const [task, setTask] = useState({
    addedDate: Date(),
    deadline: "",
    description: "",
    id: v1(),
    order: 1,
    priority: TaskPriorities.Low,
    startDate: Date(),
    status: TaskStatusType.New,
    title: "JS",
    todoListId: "1",
  });
  const changeTaskStatus = () =>
    setTask({
      addedDate: Date(),
      deadline: "",
      description: "",
      id: v1(),
      order: 1,
      priority: TaskPriorities.Low,
      startDate: Date(),
      status: TaskStatusType.Completed,
      title: "JS",
      todoListId: "1",
    });

  return (
    <Task
      task={task}
      changeStatus={changeTaskStatus}
      deleteTask={action("addNewElementCallback")}
      changeText={action("addNewElementCallback")}
    />
  );
};

export const TaskStory = Template.bind({});
TaskStory.args = {};
