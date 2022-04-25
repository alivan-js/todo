import React from 'react';
import {Provider} from "react-redux";
import {RootStateType, store} from "../app/store";
import {combineReducers, createStore} from "redux";
import {taskReducer} from "../features/Todolists/Todolist/Task/tasks-reducer";
import {todolistsReducer} from "../features/Todolists/Todolist/todolist-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatusType} from "../api/todolist-api";
import {appReducer} from "../app/app-reducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState = {
    todolists: [
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
        isLogin: false,
        userData: {
            id: null,
            login: null,
            email: null
        },
    }
}

export const StoryBookStore = createStore(rootReducer, initialGlobalState as RootStateType)

export const ReduxStoreProviderDecorator = (Component: () => React.ReactNode) => {
    return (
        <Provider store={store}>
            {Component()}
        </Provider>
    );
};