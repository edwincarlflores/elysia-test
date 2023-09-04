import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { BaseHtml } from "../index";

export const dummyRoutes = new Elysia({ prefix: "/dummy" })
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <div class="flex h-screen w-full justify-center items-center text-blue-700">
          Dummy Page
        </div>
      </BaseHtml>
    )
  );
