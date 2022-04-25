import {AppActionType, setError, setStatus} from "../app/app-reducer";
import {Dispatch} from "redux";
import {CommonResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch<AppActionType>, error: string) => {
    dispatch(setError(error))
    dispatch(setStatus("failed"))
}

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch<AppActionType>) => {
    if (data.messages.length) {
        dispatch(setError(data.messages[0]))

    } else {
        dispatch(setError("Some error occurred"))
    }
    dispatch(setStatus("failed"))
}