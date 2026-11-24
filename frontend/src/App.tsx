import { useState } from "react";
import useSWR from "swr";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";
import { Todo } from "./types";
import TodoEdit from "./TodoEdit";

export default function App() {
  const { data: todos, error, isLoading, mutate } = useSWR("todos", fetchTodos);
  const [title, setTitle] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setIsSubmitting(true);
    try {
      await createTodo(title);
      setTitle("");
      await mutate();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(todo: Todo) {
    setActionError("");
    try {
      await updateTodo({ ...todo, done: !todo.done });
      await mutate();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  async function handleSave(todo: Todo, title: string) {
    await updateTodo({ ...todo, title });
    await mutate();
  }

  async function handleDelete(todo: Todo) {
    setActionError("");
    try {
      await deleteTodo(todo.id);
      await mutate();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  return (
    <main>
      <h1>Todos</h1>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit" disabled={title.trim() === "" || isSubmitting}>
          Add
        </button>
      </form>

      {actionError && <p role="alert">{actionError}</p>}

      {isLoading && <p>Loading todos.</p>}

      {error ? (
        <div>
          <p>{error.message}</p>
          <button type="button" onClick={() => mutate()}>
            Try again
          </button>
        </div>
      ) : (
        <>
          {!isLoading && todos?.length === 0 && (
            <p>No todos yet. Add your first todo above.</p>
          )}

          <ul className="todo-list">
            {todos?.map((todo) => (
              <TodoEdit
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
