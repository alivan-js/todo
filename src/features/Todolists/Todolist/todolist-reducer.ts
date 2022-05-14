import { todolistAPI, TodoListType } from "../../../api/todolist-api";
import { RequestStatusType, setStatus } from "../../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../../utils/error";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ResultCode {
  "success" = 0,
  "error" = 1,
  "captcha" = 10,
}

// thunks

export const fetchTodoLists = createAsyncThunk(
  "todoList/fetchTodoLists",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.getTodoLists();
      thunkAPI.dispatch(setStatus({ status: "succeeded" }));
      return { todoLists: res.data };
    } catch (err) {
      // @ts-ignore
      const error: AxiosError = err;
      handleServerNetworkError(thunkAPI.dispatch, error.message);
    }
  }
);

export const addTodolistTC = createAsyncThunk(
  "todoList/addTodolist",
  async (param: { title: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.postTodolist(param.title);
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(setStatus({ status: "succeeded" }));
        return { todoList: res.data.data.item };
      } else {
        handleServerAppError<{ item: TodoListType }>(
          res.data,
          thunkAPI.dispatch
        );
      }
    } catch (err) {
      // @ts-ignore
      const error: AxiosError = err;
      handleServerNetworkError(thunkAPI.dispatch, error.message);
    }
  }
);

export const removeTodolistTC = createAsyncThunk(
  "todoList/removeTodolist",
  async (param: { id: string }, thunkAPI) => {
    thunkAPI.dispatch(setTodolistStatus({ id: param.id, status: "loading" }));
    try {
      await todolistAPI.deleteTodoList(param.id);
      thunkAPI.dispatch(
        setTodolistStatus({ id: param.id, status: "succeeded" })
      );
      return { id: param.id };
    } catch (err) {
      // @ts-ignore
      const error: AxiosError = err;
      handleServerNetworkError(thunkAPI.dispatch, error.message);
    }
  }
);

export const changeTodolistTitleTC = createAsyncThunk(
  "todoList/changeTodolistTitle",
  async (param: { id: string; title: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({ status: "loading" }));
    try {
      await todolistAPI.updateTodoListTitle(param.id, param.title);
      thunkAPI.dispatch(setStatus({ status: "succeeded" }));
      return { id: param.id, title: param.title };
    } catch (err) {
      // @ts-ignore
      const error: AxiosError = err;
      handleServerNetworkError(thunkAPI.dispatch, error.message);
    }
  }
);

// slice

const todoListSlice = createSlice({
  name: "todoList",
  initialState: [] as Array<TodoListDomainType>,
  reducers: {
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterType }>
    ) {
      const index = state.findIndex((el) => el.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    setTodolistStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((el) => el.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload) {
          const index = state.findIndex((el) => el.id === payload.id);
          state[index].title = payload.title;
        }
      })
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload) {
          return payload.todoLists.map((el) => ({
            ...el,
            filter: "all",
            entityStatus: "idle",
          }));
        }
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload) {
          const index = state.findIndex((el) => el.id === payload.id);
          state.splice(index, 1);
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload) {
          state.unshift({
            ...payload.todoList,
            filter: "all",
            entityStatus: "idle",
          });
        }
      });
  },
});

export const { changeTodolistFilter, setTodolistStatus } =
  todoListSlice.actions;
export const todoListReducer = todoListSlice.reducer;

// types

export type TodoListDomainType = TodoListType & {
  filter: FilterType;
  entityStatus: RequestStatusType;
};

export type FilterType = "all" | "active" | "complete";
