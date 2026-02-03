"use client";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useRef, useState } from "react";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Player, Position } from "../Transfers";
import Image from "next/image";

interface PlayerCardProps {
  size: number;
  player: Player;
  position: Position;
  index: number;
}

export default function PlayerCard({
  player,
  position,
  index,
  size,
}: PlayerCardProps) {
  const s = createScaler(size);

  const fs = s(10);

  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => ({ player, position, index }),
    });
  }, [player, position, index]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      getData: () => ({ player, position, index }),
    });
  }, [player, position, index]);

  return (
    <div
      className={`relative backdrop-blur-md border border-cyan-50 z-30
                  rounded-md overflow-hidden ${dragging && "opacity-20"} ${isDraggedOver && "bg-cyan-400/40 ring-4 ring-cyan-300/60"}`}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      ref={ref}
      key={`${player.name}-${player.team}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={`/shirts/shirt_${player.team}.webp`}
          alt="Liv"
          fill
          draggable={false}
          className="object-contain"
          loading="eager"
          sizes="auto"
          style={{
            padding: s(4),
          }}
        />
      </div>
      <div className="h-[30%] absolute bottom-0 w-full">
        <p
          className=" text-center bg-white rounded-t-sm select-none"
          style={{ fontSize: fs }}
        >
          {player.name}
        </p>
        <p
          className="text-center bg-gray-200 select-none"
          style={{ fontSize: fs }}
        >
          {player.price}
        </p>
      </div>
    </div>
  );
}
