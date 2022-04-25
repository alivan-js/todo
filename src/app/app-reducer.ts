import {Dispatch} from "redux";
import {authAPI, MeResponseType} from "../api/todolist-api";
import {ResultCode} from "../features/Todolists/Todolist/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error";
import {AxiosError} from "axios";
import {setIsLoggedIn} from "./auth-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}

// reducer

export const appReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {
    switch (action.type) {
        case "APP/STATUS-SET":
            return {...state, ...action.payload}
        case "APP/ERROR-SET":
            return {...state, ...action.payload}
        case "APP/INITIALIZED-SET":
            return {...state, ...action.payload}
        default:
            return state
    }
}

// actions

export const setStatus = (status: RequestStatusType) => ({type: "APP/STATUS-SET", payload: {status}}) as const
export const setError = (error: NullableType<string>) => ({type: "APP/ERROR-SET", payload: {error}}) as const
export const setIsInitialized = (isInitialized: boolean) => ({
    type: "APP/INITIALIZED-SET",
    payload: {isInitialized}
}) as const

// thunks

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.authMe().then((res) => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedIn(true))
        } else {
            handleServerAppError<MeResponseType>(res.data, dispatch)
        }
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    ).finally(
        () => {
            dispatch(setIsInitialized(true))
        }
    )
}


// types

export type NullableType<T> = null | T

type InitialStateType = typeof initialState

export type AppActionType =
    ReturnType<typeof setStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setIsInitialized>