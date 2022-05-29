import React from "react";
import { api } from "./api";
import useSWR from "swr";

import { Comment } from "./components/Comment";
import { CommentType } from "./types";
import { Header } from "./components/Header";

export const App = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);
  const [replyingTo, setReplyingTo] = React.useState<string>();

  const { data, mutate } = useSWR<Omit<CommentType, "replies">[]>(
    "/api/comments",
    api.getAll,
  );

  const comments = Array.isArray(data)
    ? data.map((c) => {
      const replies = data.filter((r) => r.parentCommentId === c.id);

      return { ...c, replies } as CommentType;
    })
    : [];

  const onAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitButtonRef.current!.disabled = true;
    const comment = inputRef.current!.value;
    if (comment) {
      await api.add(comment, replyingTo);
    }

    mutate();

    setReplyingTo(undefined);
    inputRef.current!.value = "";
    submitButtonRef.current!.disabled = false;
  };

  const handleUpvote = async (id: string) => {
    await api.upvote(id);
    mutate();
  };

  React.useEffect(() => {
    const sse = api.getEventSource();

    sse.onmessage = (e) => {
      mutate();
    };

    return () => {
      sse.close();
    };
  }, []);

  return (
    <main className="container">
      <h1>Discussion</h1>

      <Header
        buttonRef={submitButtonRef}
        inputRef={inputRef}
        onAdd={onAdd}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        comments={comments}
      />

      <ul className={`comments ${replyingTo ? "is-replying" : ""}`}>
        {comments.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).map((comment) => (
          <Comment
            key={comment.id}
            inFocus={comment.id === replyingTo}
            comment={comment}
            onUpvote={handleUpvote}
            onReply={setReplyingTo}
          />
        ))}
      </ul>
    </main>
  );
};
