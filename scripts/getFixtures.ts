import camelcaseKeys from "camelcase-keys";

export {};

async function getFixtures() {
  const fixtures = await fetch(
    `https://fantasy.premierleague.com/api/fixtures/`,
  );

  let fixturesJson = await fixtures.json();

  const camelCaseFixturesJson = camelcaseKeys(fixturesJson, { deep: true });

  Bun.write("./public/fixtures.json", JSON.stringify(camelCaseFixturesJson));
}

console.log("Started players");
await getFixtures();
console.log("Finished players");
