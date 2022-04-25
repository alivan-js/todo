import {TypedUseSelectorHook, useSelector} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {taskReducer} from "../features/Todolists/Todolist/Task/tasks-reducer";
import {todolistsReducer} from "../features/Todolists/Todolist/todolist-reducer";
import {appReducer} from "./app-reducer";
import {authReducer} from "./auth-reducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export type RootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunk))

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector
