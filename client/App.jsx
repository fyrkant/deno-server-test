import React from "react";
import { api, getEventSource } from "./api";
import useSWR from "swr";

import { Comment } from "./components/Comment";

export const App = () => {
  const inputRef = React.useRef();
  const submitButtonRef = React.useRef();
  const [replyingTo, setReplyingTo] = React.useState();

  const { data, mutate } = useSWR("/api/comments", api.getAll);
  console.log(data);
  const comments = Array.isArray(data)
    ? data.filter((c) => !c.parentCommentId).map((c) => {
      const replies = data.filter((r) => r.parentCommentId === c.id);

      return { ...c, replies };
    })
    : [];

  const onAdd = async (e) => {
    e.preventDefault();
    submitButtonRef.current.disabled = true;
    const comment = inputRef.current.value;
    if (comment) {
      await api.add(comment, replyingTo);
    }

    mutate();

    setReplyingTo(null);
    inputRef.current.value = "";
    submitButtonRef.current.disabled = false;
  };

  const handleUpvote = async (id) => {
    await api.upvote(id);
    mutate();
  };

  React.useEffect(() => {
    const sse = getEventSource();

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
      <header className="add-comment-container">
        <img
          className="avatar"
          src="https://fakeface.rest/face/view/whatever"
        />
        <div>
          {replyingTo
            ? (
              <div className="reply-to">
                Replying to:{" "}
                <span className="author">
                  {comments.find((c) => c.id === replyingTo)?.author}
                </span>
              </div>
            )
            : null}

          <input
            ref={inputRef}
            type="text"
            id="comment-input"
            placeholder="What are you thoughts?"
          />
        </div>
        {replyingTo
          ? (
            <button
              type="button"
              class="cancel-button"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </button>
          )
          : null}
        <button
          ref={submitButtonRef}
          type="button"
          id="comment-submit"
          onClick={onAdd}
        >
          Comment
        </button>
      </header>

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
