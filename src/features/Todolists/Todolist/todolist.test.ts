import {v1} from "uuid"
import {
    addTodolistTC,
    changeTodolistFilter, changeTodolistTitleTC, removeTodolistTC,
    TodoListDomainType,
    todoListReducer,
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
        {
            id: todolist_2,
            title: "What to eat",
            addedDate: Date(),
            order: "1",
            filter: "all",
            entityStatus: "loading"
        },
    ]
})

test("todolist should be deleted", () => {

        // test data

        const action = removeTodolistTC.fulfilled({id: todolist_2}, "", {id: todolist_2})

        // running of testing code

        const endState = todoListReducer(startState, action)

        // checking of result

        expect(endState).toEqual([
            {
                id: todolist_1,
                title: "What to learn",
                addedDate: Date(),
                order: "1",
                filter: "all",
                entityStatus: "loading"
            }
        ])
        expect(endState.length).toBe(1)

    }
)

test("todolist should be added", () => {

        // test data

        const newTodoList = {
            id: v1(),
            title: "What to eat",
            addedDate: new Date().getDate().toString(),
            order: "10"
        }
        const action = addTodolistTC.fulfilled({todoList: newTodoList}, "", {title: "What to eat"})

        // running of testing code

        const endState = todoListReducer(startState, action)

        // checking of result

        expect(endState.length).toBe(3)
        expect(endState[2].title).toBe("What to eat")
        expect(endState[2].filter).toBe("all")

    }
)

test("todolist title should be changed", () => {

        // test data

        const action = changeTodolistTitleTC.fulfilled({title: "What to sell", id: todolist_1}, "", {
            id: todolist_1,
            title: "What to sell"
        })

        // running of testing code

        const endState = todoListReducer(startState, action)

        // checking of result

        expect(endState[0].title).toBe("What to sell")

    }
)

test("todolist filter should be changed", () => {

        // test data

        const action = changeTodolistFilter({filter: "complete", id: todolist_2})

        // running of testing code

        const endState = todoListReducer(startState, action)

        // checking of result

        expect(endState[1].filter).toBe("complete")

    }
)