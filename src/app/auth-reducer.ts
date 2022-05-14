import {
  authAPI,
  FieldsErrorsType,
  LoginParamsType,
} from "../api/todolist-api";
import { ResultCode } from "../features/Todolists/Todolist/todolist-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error";
import axios from "axios";
import { setStatus } from "./app-reducer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// thunks

export const loginTC = createAsyncThunk<
  undefined,
  LoginParamsType,
  { rejectValue: { errors: string[]; fieldsErrors?: FieldsErrorsType[] } }
>("auth/login", async (param: LoginParamsType, thunkAPI) => {
  thunkAPI.dispatch(setStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(setStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError<{ userId: number }>(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (err) {
    let error: string = "Some error occurred";
    if (axios.isAxiosError(err)) {
      error = err.message;
    }
    handleServerNetworkError(thunkAPI.dispatch, error);
    return thunkAPI.rejectWithValue({
      errors: [error],
      fieldsErrors: undefined,
    });
  }
});

export const logoutTC = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  thunkAPI.dispatch(setStatus({ status: "loading" }));
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(setStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError<{}>(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (err) {
    let error: string = "Some error occurred";
    if (axios.isAxiosError(err)) {
      error = err.message;
    }
    handleServerNetworkError(thunkAPI.dispatch, error);
    return thunkAPI.rejectWithValue({});
  }
});

// slice

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: false,
  },
  reducers: {
    setIsLoggedIn(state) {
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state) => {
        state.isLogin = true;
      })
      .addCase(logoutTC.fulfilled, (state) => {
        state.isLogin = false;
      });
  },
});

export const { setIsLoggedIn } = authSlice.actions;
export const authReducer = authSlice.reducer;
