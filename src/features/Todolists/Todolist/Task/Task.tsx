import React, { ChangeEvent, useCallback } from "react";
import Checkbox from "@mui/material/Checkbox";
import EditableSpan from "../../../../components/EditableSpan/EditableSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TaskStatusType, TaskType } from "../../../../api/todolist-api";

type TaskPropsType = {
  task: TaskType;
  changeStatus: (status: number, taskID: string) => void;
  deleteTask: (taskID: string) => void;
  changeText: (text: string, taskID: string) => void;
};

const Task = React.memo((props: TaskPropsType) => {
  const changeTaskTextCallback = useCallback(
    (text: string) => {
      props.changeText(text, props.task.id);
    },
    [props]
  );

  const onChangeCheckboxHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.checked
        ? TaskStatusType.Completed
        : TaskStatusType.New;
      props.changeStatus(value, props.task.id);
    },
    [props]
  );

  const onClickDeleteTaskHandler = useCallback(() => {
    props.deleteTask(props.task.id);
  }, [props]);

  return (
    <li
      key={props.task.id}
      className={props.task.status ? "isDone" : ""}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Checkbox
        checked={!!props.task.status}
        size="small"
        onChange={onChangeCheckboxHandler}
      />
      <EditableSpan
        text={props.task.title}
        changeText={changeTaskTextCallback}
      />
      <IconButton onClick={onClickDeleteTaskHandler} size="small">
        <DeleteIcon />
      </IconButton>
    </li>
  );
});

export default Task;
