import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.103.0/path/mod.ts";

const DIRNAME = dirname(fromFileUrl(import.meta.url));

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // YY-MM-DD HH:MM:SS
  votes: number;
}

export const db = new Database<Comment>(`${DIRNAME}/../db.json`);
