const baseUrl = "http://localhost:8899/api";

export const fetcher = (path) => {
  return fetch(`http://localhost:8899${path}`).then((res) => res.json());
};

export const api = {
  getAll: () => {
    return fetch(baseUrl + "/comments").then((res) => res.json());
  },
  add: (text, replyingTo) => {
    return fetch(baseUrl + "/comments", {
      method: "POST",
      body: JSON.stringify({ text, replyingTo }),
    }).then((r) => r.json());
  },
  upvote: (id) => {
    return fetch(baseUrl + `/comments/${id}/vote`, {
      method: "POST",
    }).then((r) => r.json());
  },
};

export const getEventSource = () => {
  return new EventSource(baseUrl + "/comments/stream");
};
