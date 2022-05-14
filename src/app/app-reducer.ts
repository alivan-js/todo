import { authAPI, MeResponseType } from "../api/todolist-api";
import { ResultCode } from "../features/Todolists/Todolist/todolist-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error";
import { AxiosError } from "axios";
import { setIsLoggedIn } from "./auth-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NullableType } from "./store";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as NullableType<string>,
  isInitialized: false,
};

export const initializeAppTC = createAsyncThunk(
  "app/initializeApp",
  async (_, thunkAPI) => {
    authAPI
      .authMe()
      .then((res) => {
        if (res.data.resultCode === ResultCode.success) {
          thunkAPI.dispatch(setIsLoggedIn());
        } else {
          handleServerAppError<MeResponseType>(res.data, thunkAPI.dispatch);
        }
      })
      .catch((err: AxiosError) => {
        handleServerNetworkError(thunkAPI.dispatch, err.message);
      })
      .finally(() => {
        return;
      });
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setError(state, action: PayloadAction<{ error: NullableType<string> }>) {
      state.error = action.payload.error;
    },
  },
  extraReducers: (build) => {
    build.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});

export const { setStatus, setError } = appSlice.actions;
export const appReducer = appSlice.reducer;

// types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
