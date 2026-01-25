"use client";
import Image from "next/image";
import PlayerCard from "../PlayerCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isPlayer } from "@/src/utils/validatations";

//TODO:
// - They need to be draggable to make substitutions (key functionality)
// - Bin to remove a player.
// - Should take a list of 15 players (with their team, name, price)

interface TransfersProps {
  size?: number;
  perspective?: number;
  rotation?: number;
}

export interface Player {
  name: string;
  price: string;
  team: string;
}

export type Position = "GK" | "DEF" | "MID" | "FWD";

type Squad = Record<Position, Player[]>;

export default function Transfers({
  size = 600,
  perspective = 800,
  rotation = 30,
}: TransfersProps) {
  const { x: leftX, y: topY } = mapCoordinates(
    0,
    size,
    size,
    rotation,
    perspective,
  );

  const s = createScaler(size);

  const [squad, setSquad] = useState<Squad>({
    GK: [{ name: "Alisson", price: "5.5", team: "LIV" }],
    DEF: [
      { name: "Frimpong", price: "5.5", team: "LIV" },
      { name: "Konate", price: "5.5", team: "LIV" },
      { name: "Van Djik", price: "5.5", team: "LIV" },
      { name: "Kerkez", price: "5.5", team: "LIV" },
    ],
    MID: [
      { name: "Szobo", price: "5.5", team: "LIV" },
      { name: "Macca", price: "5.5", team: "LIV" },
      { name: "Wirtz", price: "5.5", team: "LIV" },
    ],
    FWD: [
      { name: "Salah", price: "5.5", team: "LIV" },
      { name: "Isak", price: "5.5", team: "LIV" },
      { name: "Gakpo", price: "5.5", team: "LIV" },
    ],
  });

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const src = source.data;
        const dest = destination.data;

        if (!isPlayer(src.player) || !isPlayer(dest.player)) {
          return;
        }

        const srcPos = src.position as Position;
        const destPos = dest.position as Position;

        const srcIndex = src.index as number;
        const destIndex = dest.index as number;

        setSquad((prev) => {
          const next = structuredClone(prev);

          const temp = next[destPos][destIndex];
          next[destPos][destIndex] = next[srcPos][srcIndex];
          next[srcPos][srcIndex] = temp;

          return next;
        });
      },
    });
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        perspective,
        margin: s(64),
      }}
    >
      <div
        className="absolute z-10 flex flex-col justify-between"
        style={{
          top: topY - s(48),
          left: leftX,
          height: size - topY,
          width: size - 2 * leftX,
          padding: s(16),
          paddingBottom: s(64),
        }}
      >
        {/* GK */}
        <div className="flex justify-center">
          {squad.GK.map((p, i) => (
            <PlayerCard
              key={`${p.name}-${p.team}`}
              player={p}
              size={size}
              position="GK"
              index={i}
            />
          ))}
        </div>

        {/* DEF */}
        <div className="flex justify-around" style={{ paddingInline: s(16) }}>
          {squad.DEF.map((p, i) => (
            <PlayerCard
              key={`${p.name}-${p.team}`}
              player={p}
              size={size}
              position="DEF"
              index={i}
            />
          ))}
        </div>

        {/* MID */}
        <div className="flex justify-around">
          {squad.MID.map((p, i) => (
            <PlayerCard
              key={`${p.name}-${p.team}`}
              player={p}
              size={size}
              position="MID"
              index={i}
            />
          ))}
        </div>

        {/* FWD */}
        <div className="flex justify-around" style={{ paddingInline: s(64) }}>
          {squad.FWD.map((p, i) => (
            <PlayerCard
              key={`${p.name}-${p.team}`}
              player={p}
              size={size}
              position="FWD"
              index={i}
            />
          ))}
        </div>
      </div>

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
  );
}
