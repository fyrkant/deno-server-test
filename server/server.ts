import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";

import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // YY-MM-DD HH:MM:SS
  votes: number;
}

const db = new Database<Comment>(`./server/db.json`);

// db.insertMany([
//   { id: 1, author: 'John', text: 'Hello', createdAt: '2020-01-01', votes: 0 },
//   { id: 2, author: 'Jane', text: 'Hi', createdAt: '2020-01-01', votes: 0 },
//   { id: 3, author: 'John', text: 'How are you?', createdAt: '2020-01-01', votes: 0 },
//   { id: 4, author: 'Jane', text: 'I am fine', createdAt: '2020-01-01', votes: 0 },
//   { id: 5, author: 'John', text: 'And you?', createdAt: '2020-01-01', votes: 0 },
//   { id: 6, author: 'Jane', text: 'I am fine too', createdAt: '2020-01-01', votes: 0 },
//   { id: 7, author: 'John', text: 'And you?', createdAt: '2020-01-01', votes: 0 },
// ])

const router = new Router();

// Add simple logger
router.use(async (context, next) => {
  console.log("[SERVER]", `${context.request.method} ${context.request.url}`);
  await next();
});

router.get("/api/comments", async (context) => {
  const cs = await db.findMany();

  console.log(cs);

  context.response.type = "json";
  context.response.body = cs;
});

router.post("/api/comments", async (context) => {
  const body = await context.request.body({ type: "json" }).value;

  console.log(body);
  await db.insertOne({
    id: nanoid(),
    createdAt: new Date().toISOString(),
    ...body,
  });

  const comments = await db.findMany();
  context.response.type = "json";
  context.response.body = comments;
});

router.post("/api/comments/:id/vote", async (context) => {
  const id = context.params.id;

  const comment = await db.findOne({ id });

  if (!comment) {
    context.response.status = 404;
    return;
  }

  await db.updateOne({ id }, { votes: comment.votes + 1 });

  const comments = await db.findMany();
  context.response.type = "json";
  context.response.body = comments;
});

const app = new Application();

// Allow CORS
app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  return next();
});

app.use(router.routes());
app.use(router.allowedMethods());

// Log about server start
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    "[SERVER]",
    `Server started on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

// Start webserver
await app.listen({ port: 8899 });
