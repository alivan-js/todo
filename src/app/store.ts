import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { taskReducer } from "../features/Todolists/Todolist/Task/tasks-reducer";
import { todoListReducer } from "../features/Todolists/Todolist/todolist-reducer";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";

const rootReducer = combineReducers({
  tasks: taskReducer,
  todoLists: todoListReducer,
  app: appReducer,
  auth: authReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type NullableType<T> = null | T;
