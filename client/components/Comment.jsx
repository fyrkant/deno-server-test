import React from "react";
import { format as formatDate } from "timeago.js";
import clsx from "clsx";

export const Comment = ({ comment, onUpvote, onReply, inFocus }) => {
  const dateString = formatDate(comment.createdAt);

  const hasReplies = comment?.replies?.length > 0;
  const isReply = comment?.parentCommentId !== undefined;

  return (
    <li
      className={clsx({
        "with-replies": hasReplies,
        "in-focus": inFocus,
      })}
    >
      <div className={"comment"}>
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
            {isReply
              ? null
              : (
                <button type="button" onClick={() => onReply(comment.id)}>
                  Reply
                </button>
              )}
          </div>
        </div>
      </div>

      {comment?.replies?.length > 0
        ? (
          <ul className="comments">
            {comment.replies.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).map((reply) => (
              <Comment key={reply.id} comment={reply} onUpvote={onUpvote} />
            ))}
          </ul>
        )
        : null}
    </li>
  );
};
