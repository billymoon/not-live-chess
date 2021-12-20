import fetch from "isomorphic-unfetch";

const say = (what) => fetch(`/api/say?what=${what}`).then((r) => r.json());
const remark = (what) =>
  fetch(`/api/remark`, { method: "POST", body: what }).then((r) => r.text());

export default {
  say,
  remark,
};
