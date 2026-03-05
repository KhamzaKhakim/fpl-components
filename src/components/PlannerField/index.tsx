"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { TransfersResponse } from "@/src/elysia/modules/transfers/model";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";

import PlannerCard from "../PlannerCard";
import { DEFAULT_TRANSFERS_SQUAD } from "./defaults";
import { Squad } from "./types";

interface PlannerProps {
  size?: number;
  perspective?: number;
  rotation?: number;
  data?: TransfersResponse | null;
  isLoading: boolean;
}

export default function PlannerField({
  size = 600,
  perspective = 800,
  rotation = 30,
  data,
  isLoading,
}: PlannerProps) {
  const { x: leftX, y: topY } = mapCoordinates(
    0,
    size,
    size,
    rotation,
    perspective,
  );

  const s = createScaler(size);

  const [squad, setSquad] = useState<Squad>(
    data?.picks || DEFAULT_TRANSFERS_SQUAD,
  );

  useEffect(() => {
    if (data?.picks) {
      setSquad(data.picks);
    }
  }, [data]);

  return (
    <div>
      x
      <div
        className="relative overflow-x-hidden"
        style={{
          perspective,
          margin: s(24),
        }}
      >
        <div
          className="absolute z-10 flex flex-col justify-between"
          style={{
            top: topY - s(64),
            left: leftX,
            height: size - topY,
            width: size - 2 * leftX,
            padding: s(16),
            paddingBottom: s(64),
          }}
        >
          {/* GK */}
          <div className="flex justify-center">
            {squad
              .map((p, i) => ({ player: p, idx: i }))
              .filter((p) => p.player.position == "GK" && p.idx < 11)
              .map((p) => (
                <PlannerCard
                  key={`${p.player.id}-${p.idx}-GK`}
                  player={p.player}
                  size={size}
                  isLoading={isLoading}
                />
              ))}
          </div>

          {/* DEF */}
          <div className="flex justify-around" style={{ paddingInline: s(16) }}>
            {squad
              .map((p, i) => ({ player: p, idx: i }))
              .filter((p) => p.player.position == "DEF" && p.idx < 11)
              .map((p) => (
                <PlannerCard
                  key={`${p.player.id}-${p.idx}-DEF`}
                  player={p.player}
                  size={size}
                  isLoading={isLoading}
                />
              ))}
          </div>

          {/* MID */}
          <div className="flex justify-around">
            {squad
              .map((p, i) => ({ player: p, idx: i }))
              .filter((p) => p.player.position == "MID" && p.idx < 11)
              .map((p) => (
                <PlannerCard
                  key={`${p.player.id}-${p.idx}-MID`}
                  player={p.player}
                  size={size}
                  isLoading={isLoading}
                />
              ))}
          </div>

          {/* FWD */}
          <div className="flex justify-around" style={{ paddingInline: s(64) }}>
            {squad
              .map((p, i) => ({ player: p, idx: i }))
              .filter((p) => p.player.position == "FWD" && p.idx < 11)
              .map((p) => (
                <PlannerCard
                  key={`${p.player.id}-${p.idx}-FWD`}
                  player={p.player}
                  size={size}
                  isLoading={isLoading}
                />
              ))}
          </div>
        </div>
        <div
          className="absolute z-50 bg-green-200/30 backdrop-blur-md flex justify-between"
          style={{
            padding: s(8),
            bottom: s(0),
            height: s(96 + 16),
            width: s(360),
            left: s(120),
            borderTopLeftRadius: s(12),
            borderTopRightRadius: s(12),
          }}
        >
          {squad
            .map((p, i) => ({ player: p, idx: i }))
            .filter((_, i) => i > 10)
            .map((p) => (
              <PlannerCard
                key={`${p.player.id}-${p.idx}-SUB`}
                player={p.player}
                size={size}
                isLoading={isLoading}
              />
            ))}
        </div>
        <div
          className="relative overflow-hidden"
          style={{
            width: size,
            height: size,
            perspective,
          }}
        >
          <Image
            src="/field.svg"
            alt="Football field"
            width={size}
            height={size}
            style={{
              transform: `rotateX(${rotation}deg)`,
              transformStyle: "preserve-3d",
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
