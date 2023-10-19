import data from "./data.js";

const recurse = (node) => {
  const found = data.filter(({ parent }) => parent === node.position);
  // if (found) {
  // 	found.children = data.filter(({ parent }) => parent === found.position).map(({ position }) => recurse(position))
  // }
  return {
    position: node.position,
    // children: found.length ? data.filter(({ parent }) => parent === found.position).map(node => recurse(node)) : []
    children: found.length ? found.map((node) => recurse(node)) : [],
  };
};

console.log(
  JSON.stringify(
    recurse(data.find(({ parent }) => parent === "8/8/8/8/8/8/8/8")),
    null,
    2
  )
);
