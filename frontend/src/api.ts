// The backend allows requests from http://localhost:5173 (CORS), so the frontend can call it directly.
import type { Todo } from "./types";

export const API_URL = "http://localhost:3001/api";

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body: { error?: string } = await response.json();
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Could not load the todos"),
    );
  }
  return response.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Could not add the todo"));
  }
  return response.json();
}

export async function updateTodo(todo: Todo): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: todo.title, done: todo.done }),
  });
  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Could not update the todo"),
    );
  }
  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Could not delete the todo"),
    );
  }
}
// updateTodo(todo: Todo): Die Funktion bekommt ein ganzes Todo-Objekt mit id, title und done. Sie enthält schon die neuen Werte, z. B. done: true.
// `${API_URL}/todos/${todo.id}`: Die URL wird zusammengesetzt, z. B. http://localhost:3001/api/todos/6aff.... Das ist dasselbe, was du vorhin in Bruno getippt hast.
// method: "PUT": Das ist die HTTP-Methode für "ersetze dieses Todo".
// headers: { "Content-Type": "application/json" }: Damit weiß Express, dass der Body JSON ist. Ohne diese Zeile bleibt request.body leer.
// JSON.stringify({ title, done }): Wandelt das Objekt in Text um, weil fetch nur Text schicken kann. Du schickst beide Felder mit, denn laut Contract ersetzt PUT das ganze Todo. Das id gehört in die URL, nicht in den Body.
// if (!response.ok) throw ...: Bei 400, 404 oder 500 wirft die Funktion einen Fehler

// Put all functions that talk to the API here (fetcher for `useSWR`, create, update, delete),
// so that your components never call `fetch` themselves.
