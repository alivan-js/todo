import { configureStore } from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk, {ThunkAction} from "redux-thunk";
import {taskReducer, TasksActionType} from "../features/Todolists/Todolist/Task/tasks-reducer";
import {todoListReducer, TodolistsActionType} from "../features/Todolists/Todolist/todolist-reducer";
import {AppActionType, appReducer} from "./app-reducer";
import {AuthActionType, authReducer} from "./auth-reducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListReducer,
    app: appReducer,
    auth: authReducer
})

export type RootStateType = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
})

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export type RootAppActionsType = AppActionType | AuthActionType | TasksActionType | TodolistsActionType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootStateType,
    unknown,
    RootAppActionsType>
