"use client";
import { createScaler } from "@/src/utils/scaler";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamsModel } from "@/src/elysia/modules/teams/model";
import { LiveModel } from "@/src/elysia/modules/live/model";

interface PointsCardProps {
  size: number;
  player: TeamsModel.PickType | LiveModel.LivePickType;
  isLoading: boolean;
}

export default function PointsCard({
  player,
  size,
  isLoading,
}: PointsCardProps) {
  const s = createScaler(size);

  const src =
    player.position === "GK"
      ? `/gk-shirts/${player.teamShortName || "ARS"}.png`
      : `/shirts/${player.teamShortName || "ARS"}.png`;

  const fs = s(10);
  const fsPoints = s(8);

  if (isLoading) {
    return (
      <Skeleton
        className="rounded-md z-30 relative"
        style={{ height: s(96), aspectRatio: "3 / 4" }}
      />
    );
  }

  let display: string | number;
  let finished = false;

  if ("fixtures" in player) {
    if (player.fixturesFinished.every(Boolean)) {
      display = player.gwPoints;
      finished = true;
    } else if (player.minutes.every((m) => m === 0)) {
      display = player.fixtures.join(", ");
    } else {
      display = `${player.gwPoints}, ${player.fixtures[1]}`;
    }
  } else {
    display = player.gwPoints;
  }

  return (
    <div
      className={`relative select-none backdrop-blur-md border border-cyan-50 z-30
                  rounded-md overflow-hidden transition-opacity duration-300 ease-in-out`}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      key={`${player.name}-${player.team}`}
    >
      <div className="relative w-full h-full">
        <img
          src={src}
          alt={player.teamShortName}
          draggable={false}
          className="object-contain w-full h-full"
          style={{
            padding: s(4),
          }}
        />
      </div>
      <div className="h-[30%] absolute bottom-0 w-full">
        <p
          className=" text-center bg-white rounded-t-sm"
          style={{ fontSize: fs }}
        >
          {player.name}
        </p>
        <p
          className={`flex justify-center items-center text-center ${finished ? "bg-gray-800 text-white" : "bg-gray-200"}`}
          style={{ fontSize: fsPoints, height: "50%" }}
        >
          {display}
        </p>
      </div>
    </div>
  );
}
