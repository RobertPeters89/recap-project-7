// Issue 2: write the mongoose schema, the model and `toTodo` here.
// Look at the Book model of Backend MongoDB: it has the same shape.
// A todo has a `title` (a required string, trimmed) and `done` (a boolean, default `false`).
// The types `Todo` and `NewTodo` are already in `../types.ts`.
import { Schema, model } from "mongoose";

export const todoSchema = new Schema({
  title: { type: String, required: true, trim: true },
  done: { type: Boolean, default: false },
});

export const todoModel = model("todos", todoSchema);

export function toTodo(doc: { id: string; title: string; done: boolean }) {
  return { id: doc.id, title: doc.title, done: doc.done };
}

// Keine eigene id im Schema. Es gibt nur die _id von MongoDB, einmalig und automatisch.
// toTodo gibt sie als id ans Frontend weiter, ohne _id und __v.
// title ist Pflicht. Ohne Titel gibt es einen Validierungsfehler, den errors.ts zum 400 macht.
// done ist standardmäßig false.
