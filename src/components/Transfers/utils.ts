import { Player } from "./types";

export function canDrop(
  dragIndex: number | null,
  dropIndex: number,
  squad: Player[],
) {
  if (dragIndex == null) return true;

  if (dragIndex == dropIndex) return false;

  const currStartingDefs = squad.filter(
    (v, i) => v.position == "DEF" && i < 11,
  ).length;
  const currStartingMids = squad.filter(
    (v, i) => v.position == "MID" && i < 11,
  ).length;
  const currStartingFwds = squad.filter(
    (v, i) => v.position == "FWD" && i < 11,
  ).length;

  if (squad[dropIndex].position == squad[dragIndex].position) return true;

  if (dragIndex < 11 && dropIndex < 11) return false;

  if (squad[dragIndex].position == "GK")
    return squad[dropIndex].position == "GK";

  if (squad[dropIndex].position == "GK") return false;

  if (currStartingDefs == 3) {
    if (squad[dragIndex].position == "DEF" && dragIndex < 11)
      return squad[dropIndex].position == "DEF";

    if (dropIndex < 11 && squad[dropIndex].position == "DEF") return false;
  }

  if (currStartingMids == 3) {
    if (squad[dragIndex].position == "MID" && dragIndex < 11)
      return squad[dropIndex].position == "MID";

    if (dropIndex < 11 && squad[dropIndex].position == "MID") return false;
  }

  if (currStartingFwds == 1) {
    if (dropIndex == 10) return false;
    if (squad[dragIndex].position == "FWD")
      return squad[dropIndex].position == "FWD";
  }

  return true;
}
