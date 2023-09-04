import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { todosRoutes } from "./routes/Todos";
import { dummyRoutes } from "./routes/Dummy";

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
  .use(todosRoutes)
  .use(dummyRoutes)
  .post("/clicked", () => <div class="text-blue-500">I'm from the server!</div>)
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export const BaseHtml = ({ children }: elements.Children) => `
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

export type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export const db: Todo[] = [
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
