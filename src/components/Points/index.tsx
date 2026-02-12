"use client";
import Image from "next/image";
import PointsCard from "../PointsCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useState } from "react";
import { Player } from "../Transfers/types";

interface PointsProps {
  size?: number;
  perspective?: number;
  rotation?: number;
  data: any;
  isLoading: boolean;
}

type Squad = Player[];

const defaultValue: Squad = [
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "GK",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "DEF",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "DEF",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "DEF",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "DEF",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "MID",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "MID",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "MID",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "FWD",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "FWD",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "FWD",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "GK",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "DEF",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "MID",
    gwPoints: 0,
  },
  {
    name: "",
    price: "45",
    team: "",
    teamShortName: "",
    position: "MID",
    gwPoints: 0,
  },
];

export default function Points({
  size = 600,
  perspective = 800,
  rotation = 30,
  data,
  isLoading,
}: PointsProps) {
  const { x: leftX, y: topY } = mapCoordinates(
    0,
    size,
    size,
    rotation,
    perspective,
  );

  const s = createScaler(size);

  const [squad, setSquad] = useState<Squad>(data?.picks || defaultValue);

  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    if (data?.picks) {
      setSquad(data.picks);
      setPoints(data.entryHistory.points);
    }
  }, [data]);

  return (
    <div className="pt-6">
      <div className="flex justify-center">
        <div
          className="bg-gray-400/20 flex flex-col justify-center"
          style={{ height: s(84), width: s(84), borderRadius: s(12) }}
        >
          <p className="text-center">Points:</p>
          <h1 className="text-center text-4xl">{points}</h1>
        </div>
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
