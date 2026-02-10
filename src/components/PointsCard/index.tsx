"use client";
import { createScaler } from "@/src/utils/scaler";
import { Skeleton } from "@/components/ui/skeleton";
import { Player } from "../Transfers/types";

interface PointsCardProps {
  size: number;
  player: Player;
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

  if (isLoading) {
    return (
      <Skeleton
        className="rounded-md z-30 relative"
        style={{ height: s(96), aspectRatio: "3 / 4" }}
      />
    );
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
        <p className="text-center bg-gray-200" style={{ fontSize: fs }}>
          {Number(player.gwPoints)}
        </p>
      </div>
    </div>
  );
}
