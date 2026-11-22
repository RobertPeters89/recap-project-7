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

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(todo, title);
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(todo.title);
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
