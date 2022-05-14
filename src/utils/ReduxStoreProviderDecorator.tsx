import React from 'react';
import {Provider} from "react-redux";
import {combineReducers} from "redux";
import {taskReducer} from "../features/Todolists/Todolist/Task/tasks-reducer";
import {todoListReducer} from "../features/Todolists/Todolist/todolist-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatusType} from "../api/todolist-api";
import {appReducer} from "../app/app-reducer";
import {authReducer} from "../app/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {RootStateType} from '../app/store';

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: RootStateType = {
    todoLists: [
        {
            id: "1",
            title: "What to learn",
            addedDate: Date(),
            order: "1",
            filter: "all",
            entityStatus: "loading"
        },
    ],
    tasks: {
        ["1"]: [
            {
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
            },
            {
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
            },
        ],
    },
    app: {
        status: "loading",
        error: null,
        isInitialized: false
    },
    auth: {
        isLogin: false
    }
}

export const StoryBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export const ReduxStoreProviderDecorator = (Component: () => React.ReactNode) => {
    return (
        <Provider store={StoryBookStore}>
            {Component()}
        </Provider>
    );
};