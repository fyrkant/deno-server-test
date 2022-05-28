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

const names = ['Rob Hope', 'Sophie Brecht', 'Cameron Lawrence', 'John Doe', 'Oliver Smith', 'Sven Svensson'];

const getRandomName = () => {
  return names[Math.floor(Math.random() * names.length)];
}

const db = new Database<Comment>(`./server/db.json`);

const router = new Router();

// Add simple logger
router.use(async (context, next) => {
  console.log("[SERVER]", `${context.request.method} ${context.request.url}`);
  await next();
});


// Get all
router.get("/api/comments", async (context) => {
  const cs = await db.findMany();

  console.log(cs);

  context.response.type = "json";
  context.response.body = cs;
});

// Add
router.post("/api/comments", async (context) => {
  const text = await context.request.body({ type: "text" }).value;

  await db.insertOne({
    author: getRandomName(),
    id: nanoid(),
    createdAt: new Date().toISOString(),
    votes: 0,
    text
  });

  const comments = await db.findMany();
  context.response.type = "json";
  context.response.body = comments;
});

// Vote
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

app.use(async (context) => {
	await send(context, context.request.url.pathname, {
		root: `./dist`,
		index: 'index.html',
	});
});

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
