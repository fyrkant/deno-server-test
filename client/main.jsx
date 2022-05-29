import ReactDOM from "react-dom/client";
import React from "react";
import { format as formatDate } from "timeago.js";
import { api, fetcher } from "./api";
import useSWR from "swr";

const Comment = ({ comment, onUpvote }) => {
  const dateString = formatDate(comment.createdAt);

  const hasReplies = comment?.replies?.length > 0;

  return (
    <li className={hasReplies ? "with-replies" : undefined}>
      <div className="comment">
        <img
          className="avatar"
          src={`https://fakeface.rest/face/view/${comment.id}`}
        />
        <div className="border" />
        <div>
          <div className="comment-header">
            <span className="author">
              <b>{comment.author}</b>
            </span>
            <span className="dot">・</span>
            <span className="date">{dateString}</span>
          </div>
          <p className="comment-content">{comment.text}</p>
          <div className="comment-footer">
            {comment.votes > 0
              ? (
                <span className="votes">
                  {comment.votes} vote{comment.votes === 1 ? "" : "s"}
                </span>
              )
              : ""}
            <button
              data-id={comment.id}
              className="upvote-button"
              onClick={() => {
                onUpvote(comment.id);
              }}
            >
              ▲ Upvote
            </button>
            <button type="button">Reply</button>
          </div>
        </div>
      </div>
      {comment?.replies?.length > 0
        ? (
          <ul className="comments">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} onUpvote={onUpvote} />
            ))}
          </ul>
        )
        : null}
    </li>
  );
};

const App = () => {
  const inputRef = React.useRef();
  const submitButtonRef = React.useRef();

  const { data, error, mutate } = useSWR("/api/comments", api.getAll);
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
      await api.add(comment);
    }

    inputRef.current.value = "";
    submitButtonRef.current.disabled = false;
  };

  const handleUpvote = async (id) => {
    await api.upvote(id);
    mutate();
  };

  return (
      <main className="container">
        <h1>Discussion</h1>
        <header className="add-comment-container">
          <img
            className="avatar"
            src="https://fakeface.rest/face/view/whatever"
          />

          <input
            ref={inputRef}
            type="text"
            id="comment-input"
            placeholder="What are you thoughts?"
          />
          <button
            ref={submitButtonRef}
            type="button"
            id="comment-submit"
            onClick={onAdd}
          >
            Comment
          </button>
        </header>

        <ul className="comments">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpvote={handleUpvote}
            />
          ))}
        </ul>
      </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
