import {
  Application,
  Router,
  send,
  ServerSentEvent,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { db } from "./db.ts";

const names = [
  "Rob Hope",
  "Sophie Brecht",
  "Cameron Lawrence",
  "John Doe",
  "Oliver Smith",
  "Sven Svensson",
];

const getRandomName = () => {
  return names[Math.floor(Math.random() * names.length)];
};

const router = new Router();

// Add simple logger
router.use(async (context, next) => {
  console.log("[SERVER]", `${context.request.method} ${context.request.url}`);
  await next();
});

// Get all
router.get("/api/comments", async (context) => {
  const cs = await db.findMany();

  context.response.type = "json";
  context.response.body = cs;
});

// Add
router.post("/api/comments", async (context) => {
  const { text, replyingTo } = await context.request.body({ type: "json" })
    .value;

  await db.insertOne({
    author: getRandomName(),
    id: nanoid(),
    createdAt: new Date().toISOString(),
    votes: 0,
    text,
    parentCommentId: replyingTo,
  });

  const comments = await db.findMany();
  context.response.type = "json";
  context.response.body = comments;
});

let triggerEvent = () => {
  // no op
};

// Vote
router.post("/api/comments/:id/vote", async (context) => {
  const id = context.params.id;

  const comment = await db.findOne({ id });

  if (!comment) {
    context.response.status = 404;
    return;
  }

  await db.updateOne({ id }, { votes: comment.votes + 1 });
  triggerEvent();
  const comments = await db.findMany();
  context.response.type = "json";
  context.response.body = comments;
});

// Event source
router.get("/api/comments/stream", (context) => {
  const target = context.sendEvents();

  triggerEvent = () => {
    target.dispatchMessage("Hello world!");
  };
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
    index: "index.html",
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
