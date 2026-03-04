export interface Todo {
  id: string;
  title: string;
  description: string | null;
  isDone: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
}

export interface TodosResponse {
  todos: Todo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}