// @ts-ignore
import {v1} from "uuid";
import {addTask, changeTaskStatus, changeTaskText, deleteTask, taskReducer, TaskStateType} from "./tasks-reducer";
import {TaskPriorities, TaskStatusType} from "../../../../api/todolist-api";
import { addTodolist, removeTodolist } from "../todolist-reducer";

let todolist_2: string
let todolist_1: string
let firstTaskId: string
let secondTaskId: string
let startState: TaskStateType


beforeEach(
    () => {
        todolist_1 = v1()
        todolist_2 = v1()
        firstTaskId = v1()
        secondTaskId = v1()

        startState = {
            [todolist_1]: [
                {
                    addedDate: new Date().getDate().toString(),
                    deadline: new Date().getDate().toString(),
                    description: "",
                    id: firstTaskId,
                    order: 1,
                    priority: TaskPriorities.Low,
                    startDate: new Date().getDate().toString(),
                    status: TaskStatusType.New,
                    title: "JS",
                    todoListId: todolist_1,
                },
                {
                    addedDate: new Date().getDate().toString(),
                    deadline: new Date().getDate().toString(),
                    description: "",
                    id: secondTaskId,
                    order: 1,
                    priority: TaskPriorities.Low,
                    startDate: new Date().getDate().toString(),
                    status: TaskStatusType.New,
                    title: "Go",
                    todoListId: todolist_1,
                },
            ],
        }
    }
)

test("task should be deleted", () => {

        // test data

        const action = deleteTask({id: firstTaskId, todolistID: todolist_1})

        // running of testing code

        const endState = taskReducer(startState, action)

        // checking of result

        expect(endState[todolist_1].length).toBe(1)
        expect(endState[todolist_1][0].id).toBe(secondTaskId)

    }
)

test("task should be added", () => {

        // test data

        const task = {
            addedDate: new Date().getDate().toString(),
            deadline: new Date().getDate().toString(),
            description: "desc",
            id: "5",
            order: 10,
            priority: TaskPriorities.Low,
            startDate: new Date().getDate().toString(),
            status: TaskStatusType.New,
            title: "Tea",
            todoListId: todolist_1
        }

        const action = addTask({task: task})

        // running of testing code

        const endState = taskReducer(startState, action)

        // checking of result

        expect(endState[todolist_1].length).toBe(3)
        expect(endState[todolist_1][2].title).toBe("Tea")

    }
)

test("task text should be changed", () => {

        // test data

        const action = changeTaskText({taskID: firstTaskId, title: "PHP", todolistID: todolist_1})

        // running of testing code

        const endState = taskReducer(startState, action)

        // checking of result

        expect(endState[todolist_1][0].title).toBe("PHP")

    }
)


test("task status should be changed", () => {

        // test data

        const action = changeTaskStatus({status: 2, taskID: firstTaskId, todolistID: todolist_1})

        // running of testing code

        const endState = taskReducer(startState, action)

        // checking of result

        expect(endState[todolist_1][0].status).toBe(2)

    }
)

test("new todolist with empty array of tasks should be added", () => {

        // test data

        const newTodoList = {
            id: v1(),
            title: "What to...",
            addedDate: new Date().getDate().toString(),
            order: "10"
        }

        const action = addTodolist({todoList: newTodoList})

        // running of testing code

        const endState = taskReducer(startState, action)
        const keys = Object.keys(endState)

        // checking of result

        expect(endState[keys[1]]).toEqual([])

    }
)

test("todolist with array of tasks should be deleted", () => {

        // test data

        const action = removeTodolist({id: todolist_2})

        // running of testing code

        const endState = taskReducer(startState, action)
        const keys = Object.keys(endState)

        // checking of result

        expect(keys.length).toBe(1)

    }
)