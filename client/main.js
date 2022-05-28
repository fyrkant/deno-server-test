const baseUrl = "http://localhost:8899/api";

const api = {
  getAll: () => {
    return fetch(baseUrl + "/comments").then((res) => res.json());
  },
  add: (comment) => {
    return fetch(baseUrl + "/comments", {
      method: "POST",
      body: JSON.stringify(comment),
    }).then((r) => r.json());
  },
  upvote: (id) => {
    return fetch(baseUrl + `/comments/${id}/vote`, {
      method: "POST",
    }).then((r) => r.json());
  },
};

const renderComment = (comment) => {
  const listItem = document.createElement("li");
  listItem.classList.add("comment");
  listItem.innerHTML = `
  <img class="avatar" src="https://fakeface.rest/face/view/${comment.id}" />
  <div>
    <div class="comment-header">
      <span class="author"><b>${comment.author}</b></span>
      <span class="dot">・</span>
      <span class="date">${comment.createdAt}</span>
    </div>
    <p class="comment-content">${comment.text}</p>
    <div class="comment-footer">
      ${
    comment.votes > 0
      ? `<span class="votes">${comment.votes} vote${
        comment.votes === 1 ? "" : "s"
      }</span>`
      : ""
  }
      <button data-id="${comment.id}" class="upvote-button">▲ Upvote</button>
      <button type="button">Reply</button>
    </div>
  </div>
  `;

  return listItem;
};

const input = document.querySelector("#comment-input");
const submitButton = document.querySelector("#comment-submit");

const appendComments = (comments) => {
  const commentList = document.querySelector("ul.comments");
  commentList.innerHTML = "";

  if (comments.length > 0) {
    comments.forEach((c) => {
      commentList.appendChild(renderComment(c));
    });
  }

  // const upvoteButtons = document.querySelectorAll("button.upvote-button");
  // upvoteButtons.forEach((button) => {
  //   console.log(button);
  //   button.addEventListener("click", (e) => {
  //     const id = e.target.dataset.id;

  //     api.upvote(id).then((comments) => {
  //       appendComments(comments);
  //     });
  //   });
  // });
};

const getComments = async () => {
  const comments = await api.getAll();
  appendComments(comments);
};

const saveComment = async (comment) => {
  const newComments = await api.add(comment);

  console.log(newComments);

  appendComments(newComments);
};

const commentsForm = document.querySelector(".comments-form");

commentsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = e.submitter.dataset.id;

  const newComments = await api.upvote(id);

  appendComments(newComments);
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  const comment = input.value;

  await saveComment({
    author: "John Doe",
    text: comment,
  });
  input.value = "";
  submitButton.disabled = false;
});

getComments();
