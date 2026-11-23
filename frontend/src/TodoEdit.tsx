import type { Todo } from "./types";
import { useState } from "react";

type TodoEditProps = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onSave: (todo: Todo, title: string) => Promise<void>;
  onDelete: (todo: Todo) => void;
};

export default function TodoEdit({
  todo,
  onToggle,
  onSave,
  onDelete,
}: TodoEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [saveError, setSaveError] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    try {
      await onSave(todo, title);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function handleCancel() {
    setTitle(todo.title);
    setSaveError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit" disabled={title.trim() === ""}>
            Save
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
        {saveError && <p role="alert">{saveError}</p>}
      </li>
    );
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo)}
      />
      <span className={todo.done ? "todo-title done" : "todo-title"}>
        {todo.title}
      </span>
      <button type="button" onClick={() => setIsEditing(true)}>
        Edit
      </button>
      <button type="button" onClick={() => onDelete(todo)}>
        Delete
      </button>
    </li>
  );
}
