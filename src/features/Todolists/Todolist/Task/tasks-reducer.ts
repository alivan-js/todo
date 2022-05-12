import {
    taskAPI,
    TaskType,
    UpdateModalTaskType
} from "../../../../api/todolist-api";
import {
    addTodolist,
    AddTodolistType,
    removeTodolist,
    RemoveTodolistType,
    ResultCode, setTodoLists,
    SetTodoListsType
} from "../todolist-reducer";
import {AppThunk, RootStateType} from "../../../../app/store";
import {AppActionType, setStatus} from "../../../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const taskSlice = createSlice(({
    name: "task",
    initialState: {} as TaskStateType,
    reducers: {
        deleteTask(state, action: PayloadAction<{ id: string, todolistID: string }>) {
            const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload.id)
            state[action.payload.todolistID].splice(index, 1)
        },
        addTask(state, action: PayloadAction<{ task: TaskType}>) {
            state[action.payload.task.todoListId].push(action.payload.task)
        },
        changeTaskStatus(state, action: PayloadAction<{ status: number, todolistID: string, taskID: string }>) {
            const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload.taskID)
            state[action.payload.todolistID][index].status = action.payload.status
        },
        changeTaskText(state, action: PayloadAction<{ title: string, todolistID: string, taskID: string }>) {
            const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload.taskID)
            state[action.payload.todolistID][index].title = action.payload.title
        },
        setTasks(state, action: PayloadAction<{ tasks: TaskType[], id: string }>) {
            state[action.payload.id] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todoList.id] = []
        })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(setTodoLists, (state, action) => {
                action.payload.todoLists.forEach((el: any) => {
                        return state[el.id] = []
                    }
                )
            })
    }
}))

export const {deleteTask, addTask, setTasks, changeTaskStatus, changeTaskText} = taskSlice.actions

export const taskReducer = taskSlice.reducer

// thunks

export const fetchTasks = (id: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    taskAPI.getTask(id).then(res => {
            dispatch(setStatus({status: "succeeded"}))
            dispatch(setTasks({tasks: res.data.items, id}))
        }
    ).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    taskAPI.postTask(todolistId, title).then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(addTask({task: res.data.data.item}))
            dispatch(setStatus({status: "succeeded"}))
        } else {
            handleServerAppError<{ item: TaskType }>(res.data, dispatch)
        }
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const changeTaskStatusTC = (todolistID: string, taskID: string, status: number): AppThunk =>
    (dispatch, getState: () => RootStateType) => {
        dispatch(setStatus({status: "loading"}))

        const currentTask = getState().tasks[todolistID].find(el => el.id === taskID)

        if (currentTask) {
            const model: UpdateModalTaskType = {
                title: currentTask.title,
                description: currentTask.description,
                status,
                priority: currentTask.priority,
                startDate: currentTask.startDate,
                deadline: currentTask.deadline,
            }

            taskAPI.updateTask(todolistID, taskID, model).then(res => {
                    dispatch(setStatus({status: "succeeded"}))
                    dispatch(changeTaskStatus({status, todolistID, taskID}))

                }
            ).catch((err: AxiosError) => {
                    handleServerNetworkError(dispatch, err.message)
                }
            )
        }
    }

export const changeTaskTitleTC = (todolistID: string, taskID: string, title: string): AppThunk =>
    (dispatch, getState: () => RootStateType) => {

        dispatch(setStatus({status: "loading"}))


        const currentTask = getState().tasks[todolistID].find(el => el.id === taskID)

        if (currentTask) {
            const model: UpdateModalTaskType = {
                title,
                description: currentTask.description,
                status: currentTask.status,
                priority: currentTask.priority,
                startDate: currentTask.startDate,
                deadline: currentTask.deadline,
            }

            taskAPI.updateTask(todolistID, taskID, model).then(res => {
                    dispatch(setStatus({status: "succeeded"}))
                    dispatch(changeTaskText({title, todolistID, taskID}))
                }
            ).catch((err: AxiosError) => {
                    handleServerNetworkError(dispatch, err.message)
                }
            )
        }
    }

export const deleteTaskTC = (todolistID: string, taskID: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    taskAPI.deleteTask(todolistID, taskID).then(res => {
        dispatch(setStatus({status: "succeeded"}))
        dispatch(deleteTask({id: taskID, todolistID}))
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

// types

export type TaskStateType = {
    [todolistId: string]: Array<TaskType>
}

export type TasksActionType =
    RemoveTodolistType
    | AddTodolistType
    | ReturnType<typeof deleteTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof changeTaskStatus>
    | ReturnType<typeof changeTaskText>
    | ReturnType<typeof setTasks>
    | SetTodoListsType
    | AppActionType