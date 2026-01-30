import { EventType } from "@/src/elysia/modules/events/types";

export {};

type Event = {
  id: number;
  name: string;
  deadline_time: string;
  deadline_time_epoch: string;
  is_current: boolean;
  highest_score: number;
};

async function getEvents() {
  const response = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
  );

  const json = await response.json();
  const events: Event[] = json?.["events"];

  const eventsMapped = events.map(
    (e) =>
      ({
        id: e.id,
        name: e.name,
        deadlinetime: e.deadline_time,
        deadlineTimeEpoch: e.deadline_time_epoch,
        isCurrent: e.is_current,
        highestScore: e.highest_score,
      }) as EventType,
  );

  Bun.write("./public/events.json", JSON.stringify(eventsMapped));
}

console.log("Started events");
await getEvents();
console.log("Finished events");
