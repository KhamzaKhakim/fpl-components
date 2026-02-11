import { EventType } from "../events/types";

export async function getCurrentGameweekId() {
  const file = Bun.file("./public/events.json");
  const events = (await file.json()) as EventType[];

  return events.find((e) => e.isCurrent)?.id;
}
