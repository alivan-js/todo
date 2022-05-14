import {setError, setStatus} from "../app/app-reducer";
import {Dispatch} from "redux";
import {CommonResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
    dispatch(setError({error}))
    dispatch(setStatus({status: "failed"}))
}

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0]}))

    } else {
        dispatch(setError({error: "Some error occurred"}))
    }
    dispatch(setStatus({status: "failed"}))
}