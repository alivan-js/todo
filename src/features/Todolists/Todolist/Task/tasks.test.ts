// @ts-ignore
import {v1} from "uuid";
import {deleteTask, taskReducer, TaskStateType} from "./tasks-reducer";
import {TaskPriorities, TaskStatusType} from "../../../../api/todolist-api";

let todolist_2: string
let todolist_1: string
let startState: TaskStateType


beforeEach(
    () => {
        todolist_1 = v1()
        todolist_2 = v1()

        startState = {
            [todolist_1]: [
                {
                    addedDate: Date(),
                    deadline: "",
                    description: "",
                    id: v1(),
                    order: 1,
                    priority: TaskPriorities.Low,
                    startDate: Date(),
                    status: TaskStatusType.New,
                    title: "JS",
                    todoListId: todolist_1,
                },
            ],
        }
    }
)

test("task should be deleted", () => {

        // test data

        const action = deleteTask("2", todolist_2)

        // running of testing code

        const endState = taskReducer(startState, action)

        // checking of result

        expect(endState[todolist_2].length).toBe(2)
        expect(endState[todolist_2][1].id).toBe("3")

    }
)

// test("task should be added", () => {
//
//         // test data
//
//         const action = addTask("Tea", todolist_2)
//
//         // running of testing code
//
//         const endState = taskReducer(startState, action)
//
//         // checking of result
//
//         expect(endState[todolist_2].length).toBe(4)
//         expect(endState[todolist_2][3].title).toBe("Tea")
//
//     }
// )

// test("task text should be changed", () => {
//
//         // test data
//
//         const action = changeTaskText("PHP", todolist_1, "1")
//
//         // running of testing code
//
//         const endState = taskReducer(startState, action)
//
//         // checking of result
//
//         expect(endState[todolist_1][0].title).toBe("PHP")
//
//     }
// )
//
//
// test("task status should be changed", () => {
//
//         // test data
//
//         const action = changeTaskStatus(2, todolist_2, "3")
//
//         // running of testing code
//
//         const endState = taskReducer(startState, action)
//
//         // checking of result
//
//         expect(endState[todolist_2][2].status).toBe(2)
//
//     }
// )

// test("new todolist with empty array of tasks should be added", () => {
//
//         // test data
//
//         const action = addTodolist(todolist_2)
//
//         // running of testing code
//
//         const endState = taskReducer(startState, action)
//         const keys = Object.keys(endState)
//
//         // checking of result
//
//         expect(endState[keys[2]]).toEqual([])
//
//     }
// )
//
// test("todolist with array of tasks should be deleted", () => {
//
//         // test data
//
//         const action = removeTodolist(todolist_2)
//
//         // running of testing code
//
//         const endState = taskReducer(startState, action)
//         const keys = Object.keys(endState)
//
//         // checking of result
//
//         expect(keys.length).toBe(1)
//
//     }
// )