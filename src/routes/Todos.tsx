import { Elysia, t } from "elysia";
import { db, type Todo } from "../index";
import { TodoItem, TodoList } from "../components/TodoList";
import * as elements from "typed-html";

export const todosRoutes = new Elysia({ prefix: "/todos" })
  .get("/", () => <TodoList todos={db} />)
  .post(
    "/toggle/:id",
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
    "/:id",
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
  );
