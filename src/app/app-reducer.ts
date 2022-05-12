import {authAPI, MeResponseType} from "../api/todolist-api";
import {ResultCode} from "../features/Todolists/Todolist/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error";
import {AxiosError} from "axios";
import {setIsLoggedIn} from "./auth-reducer";
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setError(state, action: PayloadAction<{error: NullableType<string>}>){
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{isInitialized: boolean}>){
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const {setStatus, setError, setIsInitialized} = appSlice.actions
export const appReducer = appSlice.reducer


// thunks

export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.authMe().then((res) => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedIn({isLogin: true}))
        } else {
            handleServerAppError<MeResponseType>(res.data, dispatch)
        }
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    ).finally(
        () => {
            dispatch(setIsInitialized({isInitialized: true}))
        }
    )
}

// types

export type NullableType<T> = null | T

export type AppActionType =
    ReturnType<typeof setStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setIsInitialized>