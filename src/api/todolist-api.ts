import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "3cd3afbd-79c2-4df0-94b4-063eb48d0506",
  },
});

export const todolistAPI = {
  getTodoLists() {
    return instance.get<TodoListType[]>("todo-lists");
  },
  postTodolist(title: string) {
    return instance.post<CommonResponseType<{ item: TodoListType }>>(
      "todo-lists",
      { title }
    );
  },
  deleteTodoList(id: string) {
    return instance.delete<CommonResponseType<{}>>(`todo-lists/${id}`);
  },
  updateTodoListTitle(id: string, title: string) {
    return instance.put<CommonResponseType<{}>>(`todo-lists/${id}`, { title });
  },
};

export const taskAPI = {
  getTask(todolistId: string) {
    return instance.get<GetTaskResponseType>(`/todo-lists/${todolistId}/tasks`);
  },
  postTask(todolistId: string, title: string) {
    return instance.post<CommonResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks`,
      { title }
    );
  },
  updateTask(todolistId: string, taskId: string, model: UpdateModalTaskType) {
    return instance.put<CommonResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`,
      model
    );
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<CommonResponseType<{}>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
};

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<CommonResponseType<{ userId: number }>>(
      "/auth/login",
      data
    );
  },
  logout() {
    return instance.delete<CommonResponseType<{}>>("/auth/login");
  },
  authMe() {
    return instance.get<CommonResponseType<MeResponseType>>("/auth/me");
  },
};

// types

export type MeResponseType = {
  id: number;
  login: string;
  email: string;
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: boolean;
};

export const enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export const enum TaskStatusType {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export type TodoListType = {
  id: string;
  title: string;
  addedDate: string;
  order: string;
};

export type FieldsErrorsType = {
  field: string;
  error: string;
};

export type CommonResponseType<T> = {
  resultCode: number;
  messages: string[];
  fieldsErrors?: Array<FieldsErrorsType>;
  data: T;
};

export type UpdateModalTaskType = {
  title: string;
  description: string;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
};

export type TaskType = {
  addedDate: string;
  deadline: string;
  description: string;
  id: string;
  order: number;
  priority: TaskPriorities;
  startDate: string;
  status: TaskStatusType;
  title: string;
  todoListId: string;
};

type GetTaskResponseType = {
  error: string | null;
  items: TaskType[];
  totalCount: number;
};
