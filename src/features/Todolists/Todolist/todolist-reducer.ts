import {todolistAPI, TodoListType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {AppActionType, RequestStatusType, setStatus} from "../../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error";

export enum ResultCode {
    "success" = 0,
    "error" = 1,
    "captcha" = 10
}

// reducer

export const todolistsReducer = (state: Array<TodoListDomainType> = [], action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "TODOLIST-REMOVED":
            return state.filter(el => el.id !== action.id)
        case "TODOLIST-ADDED":
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case "TODOLIST-FILTER-CHANGED":
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        case "TODOLIST-TITLE-CHANGED":
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        case "TODOLISTS-SET":
            return action.payload.map(el => ({...el, filter: "all", entityStatus: "idle"}))
        case "TODOLIST-STATUS-SET":
            return state.map(el => el.id === action.id ? {...el, entityStatus: action.status} : el)
        default:
            return state
    }
}

// actions

export const setTodoLists = (todolists: TodoListType[]) => ({type: "TODOLISTS-SET", payload: todolists}) as const
export const removeTodolist = (id: string) => ({type: "TODOLIST-REMOVED", id}) as const
export const addTodolist = (todolist: TodoListType) => ({type: "TODOLIST-ADDED", todolist}) as const
export const changeTodolistFilter = (id: string, filter: FilterType) =>
    ({type: "TODOLIST-FILTER-CHANGED", id, filter}) as const
export const changeTodolistTitle = (id: string, title: string) => ({type: "TODOLIST-TITLE-CHANGED", id, title}) as const
export const setTodolistStatus = (id: string, status: RequestStatusType) => ({
    type: "TODOLIST-STATUS-SET",
    id,
    status
}) as const

// thunks

export const fetchTodoLists = (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus("loading"))
    todolistAPI.getTodoLists().then(response => {
            dispatch(setStatus("succeeded"))
            dispatch(setTodoLists(response.data))
        }
    )
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus("loading"))
    todolistAPI.postTodolist(title).then((res) => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(addTodolist(res.data.data.item))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError<{item: TodoListType}>(res.data, dispatch)
        }
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setTodolistStatus(id, "loading"))
    todolistAPI.deleteTodoList(id).then(() => {
        dispatch(setTodolistStatus(id, "succeeded"))
        dispatch(removeTodolist(id))
    })
}

export const changeTodolistTitleTC = (todolistID: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus("loading"))
    todolistAPI.updateTodoListTitle(todolistID, title).then(() => {
        dispatch(setStatus("succeeded"))
        dispatch(changeTodolistTitle(todolistID, title))
    })
}

// types

export type TodoListDomainType = TodoListType & { filter: FilterType, entityStatus: RequestStatusType }

export type ActionType =
    RemoveTodolistType
    | AddTodolistType
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof setTodolistStatus>
    | SetTodoListsType
    | AppActionType

export type FilterType = "all" | "active" | "complete"
export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolist>
export type SetTodoListsType = ReturnType<typeof setTodoLists>