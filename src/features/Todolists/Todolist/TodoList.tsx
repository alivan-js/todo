import React, { useCallback, useEffect, useMemo } from "react";
import "../../../app/App.css";
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {
  changeTodolistFilter,
  changeTodolistTitleTC,
  removeTodolistTC,
  TodoListDomainType,
} from "./todolist-reducer";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskTC,
  changeTaskStatusTC,
  changeTaskTitleTC,
  deleteTaskTC,
  fetchTasks,
  TaskStateType,
} from "./Task/tasks-reducer";
import { RootStateType } from "../../../app/store";
import AddItemForm from "../../../components/AddItemForm/AddItemForm";
import Task from "./Task/Task";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskStatusType } from "../../../api/todolist-api";

type ToDoListProps = {
  todolist: TodoListDomainType;
};

const TodoList = React.memo((props: ToDoListProps) => {
  const tasks = useSelector<RootStateType, TaskStateType>(
    (state) => state.tasks
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks(props.todolist.id));
  }, []);

  const addTaskCallback = useCallback(
    (text: string) => {
      dispatch(addTaskTC({ todolistId: props.todolist.id, title: text }));
    },
    [dispatch, props.todolist.id]
  );

  const changeStatusTaskCallback = useCallback(
    (status: number, taskID: string) => {
      dispatch(
        changeTaskStatusTC({
          todolistID: props.todolist.id,
          taskID: taskID,
          status,
        })
      );
    },
    [dispatch, props.todolist.id]
  );

  const changeTextTaskCallback = useCallback(
    (text: string, taskID: string) => {
      dispatch(
        changeTaskTitleTC({
          todolistID: props.todolist.id,
          taskID,
          title: text,
        })
      );
    },
    [dispatch, props.todolist.id]
  );

  const deleteTaskCallback = useCallback(
    (taskID: string) => {
      dispatch(deleteTaskTC({ todolistID: props.todolist.id, taskID }));
    },
    [dispatch, props.todolist.id]
  );

  const changeTodolistTitleText = useCallback(
    (text: string) => {
      dispatch(changeTodolistTitleTC({ id: props.todolist.id, title: text }));
    },
    [dispatch, props.todolist.id]
  );

  const onClickRemoveTodolistHandler = useCallback(() => {
    dispatch(removeTodolistTC({ id: props.todolist.id }));
  }, [dispatch, props.todolist.id]);

  const onAllClickHandler = useCallback(() => {
    dispatch(changeTodolistFilter({ id: props.todolist.id, filter: "all" }));
  }, [dispatch, props.todolist.id]);

  const onCompleteClickHandler = useCallback(() => {
    dispatch(
      changeTodolistFilter({ id: props.todolist.id, filter: "complete" })
    );
  }, [dispatch, props.todolist.id]);

  const onActiveClickHandler = useCallback(() => {
    dispatch(changeTodolistFilter({ id: props.todolist.id, filter: "active" }));
  }, [dispatch, props.todolist.id]);

  const filteredTasks = useMemo(() => {
    switch (props.todolist.filter) {
      case "all": {
        return tasks[props.todolist.id];
      }
      case "active": {
        return tasks[props.todolist.id].filter(
          (el) => el.status === TaskStatusType.New
        );
      }
      case "complete": {
        return tasks[props.todolist.id].filter(
          (el) => el.status === TaskStatusType.Completed
        );
      }
      default: {
        return tasks[props.todolist.id];
      }
    }
  }, [props.todolist.filter, tasks, props.todolist.id]);

  return (
    <div style={{ width: "275px" }}>
      <EditableSpan
        text={props.todolist.title}
        changeText={changeTodolistTitleText}
      />
      <IconButton
        onClick={onClickRemoveTodolistHandler}
        disabled={props.todolist.entityStatus === "loading"}
      >
        <DeleteIcon />
      </IconButton>
      <div style={{ marginBottom: "10px" }}>
        <AddItemForm
          addNewElementCallback={addTaskCallback}
          disabled={props.todolist.entityStatus === "loading"}
        />
      </div>
      <ul style={{ margin: 0, padding: 0 }}>
        {filteredTasks.map((el) => (
          <Task
            key={el.id}
            task={el}
            changeStatus={changeStatusTaskCallback}
            deleteTask={deleteTaskCallback}
            changeText={changeTextTaskCallback}
          />
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disableElevation
          size={"small"}
          variant={"contained"}
          onClick={onAllClickHandler}
          color={props.todolist.filter === "all" ? "secondary" : "primary"}
        >
          All
        </Button>
        <Button
          disableElevation
          size={"small"}
          variant={"contained"}
          color={props.todolist.filter === "active" ? "secondary" : "primary"}
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          disableElevation
          size={"small"}
          variant={"contained"}
          color={props.todolist.filter === "complete" ? "secondary" : "primary"}
          onClick={onCompleteClickHandler}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});

export default TodoList;
