import fetch from "isomorphic-unfetch";

const say = (what) => fetch(`/api/say?what=${what}`).then((r) => r.json());

const remark = (text) =>
  fetch("/api/remarkable", {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "content-type": "application/json",
    },
  });

const remarkablePosition = (position, options) =>
  fetch("/api/remarkable", {
    method: "POST",
    body: JSON.stringify({ position, ...options }),
    headers: {
      "content-type": "application/json",
    },
  });

export default {
  say,
  remark,
  remarkablePosition,
};
