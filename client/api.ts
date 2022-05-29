const baseUrl = "http://localhost:8899/api";

export const api = {
  getAll: () => {
    return fetch(baseUrl + "/comments").then((res) => res.json());
  },
  add: (text: string, replyingTo: string | undefined) => {
    return fetch(baseUrl + "/comments", {
      method: "POST",
      body: JSON.stringify({ text, replyingTo }),
    }).then((r) => r.json());
  },
  upvote: (id: string) => {
    return fetch(baseUrl + `/comments/${id}/vote`, {
      method: "POST",
    }).then((r) => r.json());
  },
  getEventSource: () => {
    return new EventSource(baseUrl + "/comments/stream");
  },
};
