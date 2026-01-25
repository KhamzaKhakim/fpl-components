export function isPlayer(obj: any) {
  if (obj?.["name"] && obj?.["team"]) {
    return true;
  }

  return false;
}
