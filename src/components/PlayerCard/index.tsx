"use client";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useRef, useState } from "react";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Player, Position } from "../Transfers";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface PlayerCardProps {
  size: number;
  player: Player;
  index: number;
  isLoading: boolean;
}

export default function PlayerCard({
  player,
  index,
  size,
  isLoading,
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
      getInitialData: () => ({ player, index }),
    });
  }, [player, index, isLoading]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      getData: () => ({ player, index }),
    });
  }, [player, index, isLoading]);

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
      className={`relative backdrop-blur-md border border-cyan-50 z-30
                  rounded-md overflow-hidden ${dragging && "opacity-20"} ${isDraggedOver && "bg-cyan-400/40 ring-4 ring-cyan-300/60"}`}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      ref={ref}
      key={`${player.name}-${player.team}`}
    >
      <Skeleton />
      <div className="relative w-full h-full">
        <Image
          src={
            player.position === "GK"
              ? `/gk-shirts/${player.teamShortName}.png`
              : `/shirts/${player.teamShortName}.png`
          }
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
          {+player.price / 10}
        </p>
      </div>
    </div>
  );
}
