import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/nanoid.ts";
import { db } from "./db.ts";

await db.drop();

const getRandomDateString = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - Math.floor(Math.random() * 60 * 24 * 2));

  return d.toISOString();
};

await db.insertMany([
  {
    "id": nanoid(),
    "author": "Rob Hope",
    "text":
      "Jeepers now that's a huge release with some big community earnings to back it - it must be so rewarding seeing creators quit their jobs after monetizing (with real MRR) on the new platform).",
    "createdAt": getRandomDateString(),
    "votes": 0,
  },
  {
    "id": nanoid(),
    "author": "Sophie Brecht",
    "text":
      "Switched our blog from Hubspot to Ghost a year ago -- turned out to be a great decision. Looking forward to this update....the in-platform analytics look especially delicious. :)",
    "createdAt": getRandomDateString(),
    "votes": 4,
  },
  {
    "id": nanoid(),
    "author": "Cameron Lawrence",
    "text":
      "Love the native memberships and the zipless themes, I was just asked by a friend about options for a new site, and I think I know what I'll be recommending then...",
    "createdAt": getRandomDateString(),
    "votes": 0,
  },
]);

const sophiesComment = await db.findOne({
  author: "Sophie Brecht",
});

const newDate = new Date(sophiesComment?.createdAt || "");
newDate.setHours(newDate.getHours() + 1);

await db.insertOne({
  id: nanoid(),
  author: "Sven Svensson",
  text:
    "Thanks Sophie! Last year has been an absolute goldrush for the creator economy. Slowly at first, then all at once. Will be interesting to see how this ecosystem evolves over the next few years",
  createdAt: newDate.toISOString(),
  votes: 0,
  parentCommentId: sophiesComment?.id,
});
