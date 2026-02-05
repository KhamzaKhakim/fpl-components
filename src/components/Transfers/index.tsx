"use client";
import Image from "next/image";
import PlayerCard from "../PlayerCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isNumber, isPlayer, isPosition } from "@/src/utils/validatations";
import { teamsById } from "@/src/elysia/modules/utils/store";

//TODO:
// - They need to be draggable to make substitutions (key functionality)
// - Bin to remove a player.
// - Should take a list of 15 players (with their team, name, price)

interface TransfersProps {
  size?: number;
  perspective?: number;
  rotation?: number;
  data: any;
  isLoading: boolean;
}

export interface Player {
  name: string;
  price: string;
  team: string;
  teamShortName: string;
  position: Position;
  gwPoints: number;
}

export type Position = "GK" | "DEF" | "MID" | "FWD";

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

export default function Transfers({
  size = 600,
  perspective = 800,
  rotation = 30,
  data,
  isLoading,
}: TransfersProps) {
  const { x: leftX, y: topY } = mapCoordinates(
    0,
    size,
    size,
    rotation,
    perspective,
  );

  const s = createScaler(size);

  const [squad, setSquad] = useState<Squad>(data?.picks || defaultValue);

  useEffect(() => {
    if (data?.picks) {
      console.log(data.picks);
      setSquad(data.picks);
    }
  }, [data]);

  // useEffect(() => {
  //   return monitorForElements({
  //     onDrop({ source, location }) {
  //       const destination = location.current.dropTargets[0];
  //       if (!destination) return;

  //       const srcPlayer = source.data.player;
  //       const destPlayer = destination.data.player;

  //       const srcIndex = source.data.index;
  //       const destIndex = destination.data.index;

  //       if (!isPlayer(srcPlayer) || !isPlayer(destPlayer)) {
  //         return;
  //       }

  //       if (!isNumber(srcIndex) || !isNumber(destIndex)) return;

  //       setSquad((prev) => {
  //         const next = structuredClone(prev);

  //         const temp = next[destIndex];
  //         next[destIndex] = next[srcIndex];
  //         next[srcIndex] = temp;

  //         return next;
  //       });
  //     },
  //   });
  // }, []);

  return (
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
            .filter((p, i) => p.player.position == "GK" && p.idx < 11)
            .map((p, i) => (
              <PlayerCard
                key={`${i}-GK`}
                player={p.player}
                size={size}
                index={p.idx}
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
              <PlayerCard
                key={`${i}-DEF`}
                player={p.player}
                size={size}
                index={p.idx}
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
              <PlayerCard
                key={`${i}-MID`}
                player={p.player}
                size={size}
                index={p.idx}
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
              <PlayerCard
                key={`${i}-FWD`}
                player={p.player}
                size={size}
                index={p.idx}
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
            <PlayerCard
              key={`${i}-SUB`}
              player={p.player}
              size={size}
              index={p.idx}
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
          }}
        />
      </div>
    </div>
  );
}
