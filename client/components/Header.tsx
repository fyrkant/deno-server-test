import React from "react";
import { CommentType } from "../types";

export const Header: React.FC<
  {
    buttonRef: React.RefObject<HTMLButtonElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
    replyingTo: string | undefined;
    setReplyingTo: (id: string | undefined) => void;
    comments: CommentType[];
  }
> = ({ inputRef, buttonRef, onAdd, replyingTo, comments, setReplyingTo }) => {
  return (
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
            className="cancel-button"
            onClick={() => setReplyingTo(undefined)}
          >
            Cancel
          </button>
        )
        : null}
      <button
        ref={buttonRef}
        type="button"
        id="comment-submit"
        onClick={onAdd}
      >
        Comment
      </button>
    </header>
  );
};
