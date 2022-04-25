import {
    taskAPI,
    TaskType,
    UpdateModalTaskType
} from "../../../../api/todolist-api";
import {AddTodolistType, RemoveTodolistType, ResultCode, SetTodoListsType} from "../todolist-reducer";
import {Dispatch} from "redux";
import {RootStateType} from "../../../../app/store";
import {AppActionType, setStatus} from "../../../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error";

// reducer

export const taskReducer = (state: TaskStateType = {}, action: ActionType): TaskStateType => {
    switch (action.type) {
        case "TASKS_SET":
            return {...state, [action.payload.id]: action.payload.tasks}
        case "TODOLISTS-SET": {
            const copystate = {...state}
            action.payload.forEach(el => {
                    return copystate[el.id] = []
                }
            )
            return copystate
        }
        case "TODOLIST-REMOVED": {
            const copystate = {...state}
            delete copystate[action.id]
            return copystate
        }
        case "TODOLIST-ADDED":
            return {
                ...state,
                [action.todolist.id]: []
            }
        case "TASK-DELETED":
            return {...state, [action.todolistID]: state[action.todolistID].filter(el => el.id !== action.id)}
        case "TASK-ADDED":
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case "TASK-STATUS-CHANGED":
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(el => el.id === action.taskID ? {
                    ...el,
                    status: action.status
                } : el)
            }
        case "TASK-TEXT-CHANGED":
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(el => el.id === action.taskID ? {
                    ...el,
                    title: action.title
                } : el)
            }
        default:
            return state
    }
}

// actions

export const deleteTask = (id: string, todolistID: string) =>
    ({type: "TASK-DELETED", id, todolistID}) as const
export const addTask = (task: TaskType) => ({type: "TASK-ADDED", task}) as const
export const changeTaskStatus = (status: number, todolistID: string, taskID: string) =>
    ({type: "TASK-STATUS-CHANGED", todolistID, status, taskID}) as const
export const changeTaskText = (title: string, todolistID: string, taskID: string) =>
    ({type: "TASK-TEXT-CHANGED", todolistID, taskID, title}) as const
export const setTasks = (tasks: TaskType[], id: string) => ({type: "TASKS_SET", payload: {tasks, id}}) as const

// thunks

export const fetchTasks = (id: string) => (dispatch: Dispatch) => {
    dispatch(setStatus("loading"))
    taskAPI.getTask(id).then(res => {
            dispatch(setStatus("succeeded"))
            dispatch(setTasks(res.data.items, id))
        }
    )
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatus("loading"))
    taskAPI.postTask(todolistId, title).then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(addTask(res.data.data.item))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError<{ item: TaskType }>(res.data, dispatch)
        }
    }).catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        }
    )
}

export const changeTaskStatusTC = (todolistID: string, taskID: string, status: number) =>
    (dispatch: Dispatch<ActionType>, getState: () => RootStateType) => {
        dispatch(setStatus("loading"))

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
                    dispatch(setStatus("succeeded"))
                    dispatch(changeTaskStatus(status, todolistID, taskID))

                }
            )
        }
    }

export const changeTaskTitleTC = (todolistID: string, taskID: string, title: string) =>
    (dispatch: Dispatch<ActionType>, getState: () => RootStateType) => {

        dispatch(setStatus("loading"))


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
                    dispatch(setStatus("succeeded"))
                    dispatch(changeTaskText(title, todolistID, taskID))
                }
            )
        }
    }

export const deleteTaskTC = (todolistID: string, taskID: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus("loading"))
    taskAPI.deleteTask(todolistID, taskID).then(res => {
        dispatch(setStatus("succeeded"))
        dispatch(deleteTask(taskID, todolistID))
    })
}

// types

export type TaskStateType = {
    [todolistId: string]: Array<TaskType>
}
type ActionType =
    RemoveTodolistType
    | AddTodolistType
    | ReturnType<typeof deleteTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof changeTaskStatus>
    | ReturnType<typeof changeTaskText>
    | ReturnType<typeof setTasks>
    | SetTodoListsType
    | AppActionType