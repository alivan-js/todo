import {taskAPI, TaskType, UpdateModalTaskType} from "../../../../api/todolist-api";
import {addTodolistTC, fetchTodoLists, removeTodolistTC, ResultCode} from "../todolist-reducer";
import {setStatus} from "../../../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootStateType} from "../../../../app/store";

// thunks

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", (id: string, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: "loading"}))
    return taskAPI.getTask(id).then(res => {
            thunkAPI.dispatch(setStatus({status: "succeeded"}))
            return {tasks: res.data.items, id}
        }
    ).catch((err: AxiosError) => {
            handleServerNetworkError(thunkAPI.dispatch, err.message)
        }
    )
})

export const addTaskTC = createAsyncThunk("tasks/addTask", async (param: { todolistId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: "loading"}))
    try {
        const res = await taskAPI.postTask(param.todolistId, param.title)
        if (res.data.resultCode === ResultCode.success) {
            thunkAPI.dispatch(setStatus({status: "succeeded"}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError<{ item: TaskType }>(res.data, thunkAPI.dispatch)
        }
    } catch (err) {

        // @ts-ignore
        const error: AxiosError = err
        handleServerNetworkError(thunkAPI.dispatch, error.message)
    }

})

export const changeTaskStatusTC = createAsyncThunk("tasks/changeTaskStatus", async (param: { todolistID: string, taskID: string, status: number }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: "loading"}))

    const state = thunkAPI.getState() as RootStateType

    const currentTask = state.tasks[param.todolistID].find(el => el.id === param.taskID)

    if (!currentTask) {
        return thunkAPI.rejectWithValue("task not found in the state")
    }

    const model: UpdateModalTaskType = {
        title: currentTask.title,
        description: currentTask.description,
        status: param.status,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        deadline: currentTask.deadline,
    }

    if (currentTask) {

        try {
            await taskAPI.updateTask(param.todolistID, param.taskID, model)
            thunkAPI.dispatch(setStatus({status: "succeeded"}))
            return {
                status: param.status,
                todolistID: param.todolistID,
                taskID: param.taskID
            }
        } catch (err) {
            let error: string = "Some error occurred"
            if (axios.isAxiosError(err)) {
                error = err.message
            }
            handleServerNetworkError(thunkAPI.dispatch, error)
        }
    }
})

export const changeTaskTitleTC = createAsyncThunk("task/changeTaskTitle", async (param: { todolistID: string, taskID: string, title: string }, thunkAPI) => {

    thunkAPI.dispatch(setStatus({status: "loading"}))

    const state = thunkAPI.getState() as RootStateType
    const currentTask = state.tasks[param.todolistID].find(el => el.id === param.taskID)

    if (!currentTask) {
        return thunkAPI.rejectWithValue("task not found in the state")
    }

    const model: UpdateModalTaskType = {
        title: param.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        deadline: currentTask.deadline,
    }

    try {
        await taskAPI.updateTask(param.todolistID, param.taskID, model)
        thunkAPI.dispatch(setStatus({status: "succeeded"}))
        return {title: param.title, todolistID: param.todolistID, taskID: param.taskID}
    } catch (err) {
        let error: string = "Some error occurred"
        if (axios.isAxiosError(err)) {
            error = err.message
        }
        handleServerNetworkError(thunkAPI.dispatch, error)
    }
})

export const deleteTaskTC = createAsyncThunk("task/deleteTask", async (param: { todolistID: string, taskID: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: "loading"}))
    try {
        await taskAPI.deleteTask(param.todolistID, param.taskID)
        thunkAPI.dispatch(setStatus({status: "succeeded"}))
        return {id: param.taskID, todolistID: param.todolistID}
    } catch (err) {
        let error: string = "Some error occurred"
        if (axios.isAxiosError(err)) {
            error = err.message
        }
        handleServerNetworkError(thunkAPI.dispatch, error)
    }
})

// slice

const taskSlice = createSlice(({
    name: "task",
    initialState: {} as TaskStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload) {
                state[payload.todoList.id] = []
            }
        })
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload) {
                    delete state[payload.id]
                }
            })
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload) {
                    payload.todoLists.forEach((el: any) => {
                            return state[el.id] = []
                        }
                    )
                }
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.id] = action.payload.tasks
                }
            }).addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            }
        }).addCase(deleteTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload?.id)
                state[action.payload.todolistID].splice(index, 1)
            }
        }).addCase(changeTaskStatusTC.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload) {
                const index = state[payload.todolistID].findIndex(el => el.id === payload.taskID)
                state[payload.todolistID][index].status = payload.status
            }
        }).addCase(changeTaskTitleTC.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload) {
                const index = state[payload.todolistID].findIndex(el => el.id === payload.taskID)
                state[payload.todolistID][index].title = payload.title
            }
        })
    }
}))

export const taskReducer = taskSlice.reducer

// types

export type TaskStateType = {
    [todolistId: string]: Array<TaskType>
}