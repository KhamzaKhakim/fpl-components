"use client";
import Image from "next/image";
import PointsCard from "../PointsCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useState } from "react";
import { LiveModel } from "@/src/elysia/modules/live/model";
import { Squad } from "./types";
import { DEFAULT_POINTS_SQUAD } from "./defaults";

interface PointsProps {
  size?: number;
  perspective?: number;
  rotation?: number;
  data?: LiveModel.LivePointsResponse | null;
  isLoading: boolean;
  currGameweek?: number;
  gameweek: number | null;
  setGameweek: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function Points({
  size = 600,
  perspective = 800,
  rotation = 30,
  data,
  isLoading,
  currGameweek,
  gameweek,
  setGameweek,
}: PointsProps) {
  const { x: leftX, y: topY } = mapCoordinates(
    0,
    size,
    size,
    rotation,
    perspective,
  );

  const s = createScaler(size);

  const [squad, setSquad] = useState<Squad>(
    data?.picks || DEFAULT_POINTS_SQUAD,
  );

  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    if (data?.picks) {
      setSquad(data.picks);
      setPoints(
        data.picks.slice(0, 11).reduce((acc, curr) => acc + curr.gwPoints, 0),
      );
    }
  }, [data]);

  return (
    <div className="pt-6">
      <div className="flex justify-center items-center gap-4">
        <button
          aria-label="Previous gameweek"
          disabled={!gameweek || !currGameweek || gameweek === 1}
          onClick={() => setGameweek((g) => g! - 1)}
          className={`
          p-2 rounded-lg transition 
          ${
            !gameweek || !currGameweek || gameweek === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-200"
          }
          `}
        >
          <img src="./icons/arrow-left.svg" alt="Prev" className="w-5 h-5" />
        </button>

        <div
          className="flex flex-col justify-center items-center bg-gray-200/50 text-gray-900 transition"
          style={{ width: s(88), height: s(88), borderRadius: s(12) }}
        >
          <p className="text-center text-sm font-medium">GW {gameweek}</p>
          <p className="text-center text-xs text-gray-600">points:</p>
          <h1 className="text-center text-2xl font-bold">{points}</h1>
        </div>

        <button
          aria-label="Next gameweek"
          disabled={!gameweek || !currGameweek || gameweek === currGameweek}
          onClick={() => setGameweek((g) => g! + 1)}
          className={`
            p-2 rounded-lg transition
            ${
              !gameweek || !currGameweek || gameweek === currGameweek
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-200"
            }
          `}
        >
          <img src="./icons/arrow-right.svg" alt="Next" className="w-5 h-5" />
        </button>
      </div>
      <div
        className="relative overflow-x-hidden"
        style={{
          perspective,
          margin: s(12),
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
              .filter((p, i) => p.player.position == "GK" && p.idx < 11)
              .map((p, i) => (
                <PointsCard
                  key={`${i}-GK`}
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
              .filter((p, i) => p.player.position == "DEF" && p.idx < 11)
              .map((p, i) => (
                <PointsCard
                  key={`${i}-DEF`}
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
              .filter((p, i) => p.player.position == "MID" && p.idx < 11)
              .map((p, i) => (
                <PointsCard
                  key={`${i}-MID`}
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
              .filter((p, i) => p.player.position == "FWD" && p.idx < 11)
              .map((p, i) => (
                <PointsCard
                  key={`${i}-FWD`}
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
            .map((p, i) => (
              <PointsCard
                key={`${i}-SUB`}
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
            src="field.svg"
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
