import { useState } from "react";
import useSWR from "swr";
import { fetchTodos, createTodo, updateTodo } from "./api";
import { Todo } from "./types";
import TodoEdit from "./TodoEdit";

export default function App() {
  const { data: todos, isLoading, mutate } = useSWR("todos", fetchTodos);
  const [title, setTitle] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await createTodo(title);
    setTitle("");
    await mutate();
  }

  async function handleToggle(todo: Todo) {
    await updateTodo({ ...todo, done: !todo.done });
    await mutate();
  }

  async function handleSave(todo: Todo, title: string) {
    await updateTodo({...todo, title});
    await mutate();
  }

  return (
    <main>
      <h1>Todos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit" disabled={title.trim() === ""}>
          Add
        </button>
      </form>

      {isLoading && <p>Loading todos.</p>}

      {!isLoading && (!todos || todos.length === 0) && <p>No todos yet.</p>}

      <ul>
        {todos?.map((todo) => (
          <TodoEdit key={todo.id} todo={todo} onToggle={handleToggle} onSave={handleSave}/>
        ))}
      </ul>
    </main>
  );
}
