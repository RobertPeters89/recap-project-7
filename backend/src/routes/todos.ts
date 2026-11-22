import { Router } from "express";
import { todoModel, toTodo } from "../models/Todo.js";

export const todosRouter = Router();

todosRouter.get("/", async (request, response) => {
  const todos = await todoModel.find();
  response.json(todos.map(toTodo));
});

todosRouter.post("/", async (request, response) => {
  const todo = await todoModel.create({ title: request.body?.title });
  response.status(201).json(toTodo(todo));
});

todosRouter.put("/:id", async (request, response) => {
  const todo = await todoModel.findByIdAndUpdate(
    request.params.id,
    { title: request.body?.title, done: request.body?.done },
    { returnDocument: "after", runValidators: true },
  );
  if (!todo) {
    response.status(404).json({ error: "Todo not found" });
    return;
  }
  response.json(toTodo(todo));
});

todosRouter.delete("/:id", async (request, response) => {
  const todo = await todoModel.findByIdAndDelete(request.params.id);
  if (!todo) {
    response.status(404).json({ error: "Todo not found" });
    return;
  }
  response.status(204).send();
});
// Issue 2: add the routes here. The router is already mounted on /api/todos in app.ts.
//
// GET    /api/todos       -> 200 with the list of todos
// POST   /api/todos       -> 201 with the new todo
// PUT    /api/todos/:id   -> 200 with the updated todo, 404 for an unknown id
// DELETE /api/todos/:id   -> 204 without a body, 404 for an unknown id
//
// The contract is in docs/api-contract.md at the root of the project.
