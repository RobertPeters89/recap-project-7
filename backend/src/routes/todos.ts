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
// Issue 2: add the routes here. The router is already mounted on /api/todos in app.ts.
//
// GET    /api/todos       -> 200 with the list of todos
// POST   /api/todos       -> 201 with the new todo
// PUT    /api/todos/:id   -> 200 with the updated todo, 404 for an unknown id
// DELETE /api/todos/:id   -> 204 without a body, 404 for an unknown id
//
// The contract is in docs/api-contract.md at the root of the project.


