import {v1} from "uuid"
import {
    removeTodolist,
    TodoListDomainType,
    todolistsReducer,
} from "./todolist-reducer";

let todolist_1: string
let todolist_2: string
let startState: Array<TodoListDomainType>

beforeEach(() => {

    todolist_1 = v1()
    todolist_2 = v1()

    startState = [
        {
            id: todolist_1,
            title: "What to learn",
            addedDate: Date(),
            order: "1",
            filter: "all",
            entityStatus: "loading"
        },
    ]
})

test("todolist should be deleted", () => {

        // test data

        const action = removeTodolist(todolist_2)

        // running of testing code

        const endState = todolistsReducer(startState, action)

        // checking of result

        expect(endState).toEqual([
            {id: todolist_1, title: "What to learn", filter: "all"}
        ])
        expect(endState.length).toBe(1)

    }
)
//
// test("todolist should be added", () => {
//
//         // test data
//
//         const action = addTodolist("What to eat")
//
//         // running of testing code
//
//         const endState = todolistsReducer(startState, action)
//
//         // checking of result
//
//         expect(endState.length).toBe(3)
//         expect(endState[2].title).toBe("What to eat")
//         expect(endState[2].filter).toBe("all")
//
//     }
// )

// test("todolist title should be changed", () => {
//
//         // test data
//
//         const action = changeTodolistTitle(todolist_1, "What to sell")
//
//         // running of testing code
//
//         const endState = todolistsReducer(startState, action)
//
//         // checking of result
//
//         expect(endState[0].title).toBe("What to sell")
//
//     }
// )

// test("todolist filter should be changed", () => {
//
//         // test data
//
//         const action = changeTodolistFilter(todolist_2, "complete")
//
//         // running of testing code
//
//         const endState = todolistsReducer(startState, action)
//
//         // checking of result
//
//         expect(endState[1].filter).toBe("complete")
//
//     }
// )