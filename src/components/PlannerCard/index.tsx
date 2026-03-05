"use client";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { PickType } from "@/src/elysia/modules/transfers/model";
import { createScaler } from "@/src/utils/scaler";

interface PlayerCardProps {
  size: number;
  player: PickType;
  isLoading: boolean;
}

export default function PlannerCard({
  player,
  size,
  isLoading,
}: PlayerCardProps) {
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
      className={`relative select-none backdrop-blur-md border border-cyan-50 z-30 cursor-grab
                  rounded-md overflow-hidden transition-opacity duration-300 ease-in-out`}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      key={`${player.name}-${player.team}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={player.teamShortName}
          draggable={false}
          height={s(96)}
          width={s(72)}
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
          £{Number(player.sellCost) / 10}m
        </p>
      </div>
    </div>
  );
}
