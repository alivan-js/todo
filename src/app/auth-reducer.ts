import {authAPI, LoginParamsType} from "../api/todolist-api";
import {ResultCode} from "../features/Todolists/Todolist/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error";
import {AxiosError} from "axios";
import {setStatus} from "./app-reducer";
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLogin: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoggedIn (state, action: PayloadAction<{isLogin: boolean}>) {
            state.isLogin = action.payload.isLogin
        }
    }
})

export const {setIsLoggedIn} = authSlice.actions
export const authReducer = authSlice.reducer

// thunk

export const loginTC = (loginParams: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    authAPI.login(loginParams).then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedIn({isLogin: true}))
            dispatch(setStatus({status: "succeeded"}))
        } else {
            handleServerAppError<{ userId: number }>(res.data, dispatch)
        }
    })
        .catch((err: AxiosError) => {
                handleServerNetworkError(dispatch, err.message)
            }
        )
}

export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    authAPI.logout().then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedIn({isLogin: false}))
            dispatch(setStatus({status: "succeeded"}))
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

export type AuthActionType = ReturnType<typeof setIsLoggedIn>