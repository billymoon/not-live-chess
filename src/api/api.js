import fetch from "isomorphic-unfetch";

const say = (what) => fetch(`/api/say?what=${what}`).then((r) => r.json());

export default {
  say,
};
