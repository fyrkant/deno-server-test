import { createApp, createRouter } from "https://deno.land/x/servest@v1.3.1/mod.ts";
import { Database } from 'https://deno.land/x/aloedb@0.9.0/mod.ts';

interface Comment {
  id: number;
  author: string;
  text: string;
  createdAt: string; // ISO 8601
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

const app = createApp();

const ApiRoutes = ()=> {
  const router = createRouter();
  router.get("/comments", async (req) => {
    const cs = await db.findMany();

    console.log(cs)

    await req.respond({
      status: 200,
      headers: new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }),
      body: JSON.stringify(cs),
    });


    // GET /users
  });
  router.post("/comments", (req) => {
    // POST /users
  });
  router.post("/sign_in", (req) => {
    // GET /users/sign_in,
  });
  return router;
}

app.route('/api', ApiRoutes())
app.listen({ port: 8899 });