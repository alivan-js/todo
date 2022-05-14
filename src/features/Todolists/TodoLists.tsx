import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType, useAppSelector } from "../../app/store";
import {
  addTodolistTC,
  fetchTodoLists,
  TodoListDomainType,
} from "./Todolist/todolist-reducer";
import { Container, Grid, Paper } from "@mui/material";
import TodoList from "./Todolist/TodoList";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";

const TodoLists = () => {
  const todolists = useSelector<RootStateType, TodoListDomainType[]>(
    (state) => state.todoLists
  );
  const dispatch = useDispatch();
  const isLogin = useAppSelector<boolean>((state) => state.auth.isLogin);

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    dispatch(fetchTodoLists());
  }, []);

  const addTodoListCallback = useCallback(
    (title: string) => {
      dispatch(addTodolistTC({ title }));
    },
    [dispatch]
  );

  const todolistComponents = todolists.map((el) => {
    return (
      <Grid item key={el.id}>
        <Paper style={{ padding: "20px" }}>
          <TodoList todolist={el} />
        </Paper>
      </Grid>
    );
  });

  if (!isLogin) {
    return <Navigate to={"login"} />;
  }

  return (
    <div>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addNewElementCallback={addTodoListCallback} />
        </Grid>
        <Grid container spacing={5}>
          {todolistComponents}
        </Grid>
      </Container>
    </div>
  );
};

export default TodoLists;
