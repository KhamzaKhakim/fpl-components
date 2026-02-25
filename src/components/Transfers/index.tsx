"use client";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Image from "next/image";
import { useEffect, useState } from "react";

import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";
import { isNumber, isPlayer } from "@/src/utils/validatations";

import PlayerCard from "../PlayerCard";
import { DEFAULT_TRANSFERS_SQUAD } from "./defaults";
import { Player, Squad } from "./types";
import { canDrop } from "./utils";

//TODO:
// ✅ They need to be draggable to make substitutions (key functionality)
// - Bin to remove a player.
// ✅ Should take a list of 15 players (with their team, name, price)

interface TransfersProps {
  size?: number;
  perspective?: number;
  rotation?: number;
  data: any;
  isLoading: boolean;
}

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

  const [squad, setSquad] = useState<Squad>(
    data?.picks || DEFAULT_TRANSFERS_SQUAD,
  );
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  useEffect(() => {
    if (data?.picks) {
      setSquad(data.picks);
    }
  }, [data]);

  useEffect(() => {
    return monitorForElements({
      onDragStart({ source }) {
        const data = source.data as { index: number; player: Player };
        setSelectedPlayer(data.index);
      },
      onDrop({ source, location }) {
        setSelectedPlayer(null);
        const destination = location.current.dropTargets[0];

        if (!destination) return;

        const srcPlayer = source.data.player;
        const destPlayer = destination.data.player;

        const srcIndex = source.data.index;
        const destIndex = destination.data.index;

        if (!isPlayer(srcPlayer) || !isPlayer(destPlayer)) {
          return;
        }

        if (!isNumber(srcIndex) || !isNumber(destIndex)) return;

        setSquad((prev) => {
          const next = structuredClone(prev);

          const temp = next[destIndex];
          next[destIndex] = next[srcIndex];
          next[srcIndex] = temp;

          return next;
        });
      },
    });
  }, []);

  return (
    <div>
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
                  key={`${p.player.id}-${p.idx}-GK`}
                  player={p.player}
                  size={size}
                  index={p.idx}
                  isLoading={isLoading}
                  canDrop={canDrop(selectedPlayer, p.idx, squad)}
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
                  key={`${p.player.id}-${p.idx}-DEF`}
                  player={p.player}
                  size={size}
                  index={p.idx}
                  isLoading={isLoading}
                  canDrop={canDrop(selectedPlayer, p.idx, squad)}
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
                  key={`${p.player.id}-${p.idx}-MID`}
                  player={p.player}
                  size={size}
                  index={p.idx}
                  isLoading={isLoading}
                  canDrop={canDrop(selectedPlayer, p.idx, squad)}
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
                  key={`${p.player.id}-${p.idx}-FWD`}
                  player={p.player}
                  size={size}
                  index={p.idx}
                  isLoading={isLoading}
                  canDrop={canDrop(selectedPlayer, p.idx, squad)}
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
                key={`${p.player.id}-${p.idx}-SUB`}
                player={p.player}
                size={size}
                index={p.idx}
                isLoading={isLoading}
                canDrop={canDrop(selectedPlayer, p.idx, squad)}
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
