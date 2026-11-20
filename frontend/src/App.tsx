import useSWR from "swr";
import { fetchTodos } from "./api";

export default function App() {
  const { data: todos, isLoading } = useSWR("todos", fetchTodos);

  if (isLoading) {
    return <p>Loading todos.</p>;
  }

  if (!todos || todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <main>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.done} readOnly />
            <span className={todo.done ? "done" : ""}>{todo.title}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
