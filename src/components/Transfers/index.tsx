"use client";
import Image from "next/image";
import PlayerCard from "../PlayerCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isNumber, isPlayer, isPosition } from "@/src/utils/validatations";

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
  position: Position;
}

export type Position = "GK" | "DEF" | "MID" | "FWD" | "SUB";

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
    GK: [{ name: "Alisson", price: "5.5", team: "LIV", position: "GK" }],
    DEF: [
      { name: "Frimpong", price: "5.5", team: "LIV", position: "DEF" },
      { name: "Konate", price: "5.5", team: "LIV", position: "DEF" },
      { name: "Van Djik", price: "5.5", team: "LIV", position: "DEF" },
      { name: "Kerkez", price: "5.5", team: "LIV", position: "DEF" },
    ],
    MID: [
      { name: "Szobo", price: "5.5", team: "LIV", position: "MID" },
      { name: "Macca", price: "5.5", team: "LIV", position: "MID" },
      { name: "Wirtz", price: "5.5", team: "LIV", position: "MID" },
    ],
    FWD: [
      { name: "Salah", price: "5.5", team: "LIV", position: "FWD" },
      { name: "Isak", price: "5.5", team: "LIV", position: "FWD" },
      { name: "Gakpo", price: "5.5", team: "LIV", position: "FWD" },
    ],
    SUB: [
      { name: "Mamardashvili", price: "5.5", team: "LIV", position: "GK" },
      { name: "Gomez", price: "5.5", team: "LIV", position: "DEF" },
      { name: "Grava", price: "5.5", team: "LIV", position: "MID" },
      { name: "Jones", price: "5.5", team: "LIV", position: "MID" },
    ],
  });

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const srcPlayer = source.data.player;
        const destPlayer = destination.data.player;

        const srcPos = source.data.position;
        const destPos = destination.data.position;

        const srcIndex = source.data.index;
        const destIndex = destination.data.index;

        if (!isPlayer(srcPlayer) || !isPlayer(destPlayer)) {
          return;
        }

        if (!isPosition(srcPos) || !isPosition(destPos)) return;

        if (!isNumber(srcIndex) || !isNumber(destIndex)) return;

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
          {squad.GK.map((p, i) => (
            <PlayerCard
              key={`${i}-GK`}
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
              key={`${i}-DEF`}
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
              key={`${i}-MID`}
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
              key={`${i}-FWD`}
              player={p}
              size={size}
              position="FWD"
              index={i}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute z-50 bg-gray-100 flex justify-between"
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
        {squad.SUB.map((p, i) => (
          <PlayerCard
            key={`${i}-DEF`}
            player={p}
            size={size}
            position="SUB"
            index={i}
          />
        ))}
      </div>
      {/* <div
        className="absolute bg-amber-200 z-10"
        style={{
          height: s(96),
          width: "50%",
          bottom: `-${s(48)}px`,
        }}
      ></div> */}

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
