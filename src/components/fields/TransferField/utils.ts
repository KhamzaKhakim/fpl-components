import { PickType } from "@/src/elysia/modules/transfers/model";

export function canDrop(
  dragIndex: number | null,
  dropIndex: number,
  squad: PickType[],
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
    if (dropIndex < 11 && squad[dropIndex].position == "DEF") return false;
    if (squad[dragIndex].position == "DEF" && dragIndex < 11) return false;
  }

  if (currStartingMids == 2) {
    if (dropIndex < 11 && squad[dropIndex].position == "MID") return false;
    if (squad[dragIndex].position == "MID" && dragIndex < 11) return false;
  }

  if (currStartingFwds == 1) {
    if (dropIndex < 11 && squad[dropIndex].position == "FWD") return false;
    if (squad[dragIndex].position == "FWD" && dragIndex < 11) return false;
  }

  return true;
}
