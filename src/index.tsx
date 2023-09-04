import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { TodoItem, TodoList } from "./components/Todo";

export type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

const db: Todo[] = [
  {
    id: 1,
    content: "First item",
    completed: true,
  },
  {
    id: 2,
    content: "Second item",
    completed: false,
  },
];

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.5"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="/styles.css" rel="stylesheet">
</head>
<body>
  ${children}
</body>
`;

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <div
          class="flex h-screen w-full justify-center items-center"
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
          id="container-body"
        />
      </BaseHtml>
    )
  )
  .get("/todos", () => <TodoList todos={db} />)
  .post(
    "/todos/toggle/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id);
      if (todo) {
        todo.completed = !todo.completed;
        return <TodoItem {...todo} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    "/todos/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id);
      if (todo) {
        db.splice(db.indexOf(todo), 1);
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/todos",
    ({ body }) => {
      if (body.content.length === 0) {
        throw new Error("Content cannot be empty");
      }

      const dbRowsCount = db.length;

      const newTodo: Todo = {
        id: dbRowsCount + 1,
        content: body.content,
        completed: false,
      };

      db.push(newTodo);

      return <TodoItem {...newTodo} />;
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )
  .get("/dummy", ({ html }) =>
    html(
      <BaseHtml>
        <div class="flex h-screen w-full justify-center items-center text-blue-700">
          Dummy Page
        </div>
      </BaseHtml>
    )
  )
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
