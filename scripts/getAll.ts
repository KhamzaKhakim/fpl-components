export {};

async function getAllData() {
  const response = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
  );

  const json = await response.json();

  Bun.write("./public/all-chips.json", JSON.stringify(json.chips));
}

console.log("Started all data");
await getAllData();
console.log("Finished all data");
