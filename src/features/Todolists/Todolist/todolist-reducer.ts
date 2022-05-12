import {todolistAPI, TodoListType} from "../../../api/todolist-api";
import {AppActionType, RequestStatusType, setStatus} from "../../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error";
import {AppThunk} from "../../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum ResultCode {
    "success" = 0,
    "error" = 1,
    "captcha" = 10
}

const todoListSlice = createSlice({
    name: "todoList",
    initialState: [] as Array<TodoListDomainType>,
    reducers: {
        setTodoLists(state, action: PayloadAction<{ todoLists: TodoListType[] }>) {
            return action.payload.todoLists.map(el => ({...el, filter: "all", entityStatus: "idle"}))
        },
        removeTodolist(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state.splice(index, 1)
        },
        addTodolist(state, action: PayloadAction<{ todoList: TodoListType }>) {
            state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
        },
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].title = action.payload.title
        },
        setTodolistStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    }
})

export const {
    setTodoLists,
    removeTodolist,
    addTodolist,
    changeTodolistFilter,
    changeTodolistTitle,
    setTodolistStatus
} = todoListSlice.actions
export const todoListReducer = todoListSlice.reducer

// thunks

export const fetchTodoLists = (): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.getTodoLists().then(res => {
            dispatch(setStatus({status: "succeeded"}))
            dispatch(setTodoLists({todoLists: res.data}))
        }
    ).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.postTodolist(title).then((res) => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(addTodolist({todoList: res.data.data.item}))
            dispatch(setStatus({status: "succeeded"}))
        } else {
            handleServerAppError<{ item: TodoListType }>(res.data, dispatch)
        }
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setTodolistStatus({id, status: "loading"}))
    todolistAPI.deleteTodoList(id).then(() => {
        dispatch(setTodolistStatus({id, status: "succeeded"}
        ))
        dispatch(removeTodolist({id}))
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.updateTodoListTitle(id, title).then(() => {
        dispatch(setStatus({status: "succeeded"}))
        dispatch(changeTodolistTitle({id, title}))
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

// types

export type TodoListDomainType = TodoListType & { filter: FilterType, entityStatus: RequestStatusType }

export type TodolistsActionType =
    RemoveTodolistType
    | AddTodolistType
    | SetTodoListsType
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof setTodolistStatus>
    | AppActionType

export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolist>
export type SetTodoListsType = ReturnType<typeof setTodoLists>

export type FilterType = "all" | "active" | "complete"