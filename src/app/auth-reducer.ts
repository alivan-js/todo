import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {ResultCode} from "../features/Todolists/Todolist/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error";
import {AxiosError} from "axios";
import {setStatus} from "./app-reducer";

const initialState = {
    isLogin: false
}

// reducer

export const authReducer = (state: initialStateType = initialState, action: AppActionType): initialStateType => {
    switch (action.type) {
        case "AUTH/IS-LOGGED-IN-SET":
            return {...state, ...action.payload}
        default:
            return state
    }
}

// actions

export const setIsLoggedIn = (isLogin: boolean) => ({type: "AUTH/IS-LOGGED-IN-SET", payload: {isLogin}}) as const

// thunk

export const loginTC = (loginParams: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setStatus("loading"))
    authAPI.login(loginParams).then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedIn(true))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError<{ userId: number }>(res.data, dispatch)
        }
    })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setStatus("loading"))
    authAPI.logout().then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedIn(false))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError<{}>(res.data, dispatch)
        }
    })
        .catch((err: AxiosError) => {
                handleServerNetworkError(dispatch, err.message)
            }
        )
}

// types

type initialStateType = typeof initialState

export type AppActionType = ReturnType<typeof setIsLoggedIn>