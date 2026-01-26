"use client";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useRef, useState } from "react";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Player, Position } from "../Transfers";

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
  }, []);

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
  }, []);

  // if (dragging) {
  //   console.log(name + " is getting dragged");
  // }

  // if (isDraggedOver) {
  //   console.log("dragged over " + name);
  // }

  //TODO: fix bardrop blur while dragging
  return (
    <div
      className={`backdrop-blur-md border-2 border-cyan-50 z-30
                  rounded-md overflow-hidden bg-transparent ${isDraggedOver && "bg-cyan-400/40 ring-4 ring-cyan-300/60"}`}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      ref={ref}
    >
      <div>
        <div className="h-[70%]"></div>
        <p
          className="h-[15%] text-center bg-white rounded-t-sm select-none"
          style={{ fontSize: fs }}
        >
          {player.name}
        </p>
        <p
          className="h-[15%] text-center bg-gray-200 select-none"
          style={{ fontSize: fs }}
        >
          {player.price}
        </p>
      </div>

      {/* <p
        className="h-[15%] text-center bg-blue-950 text-white"
        style={{ fontSize: fs }}
      >
        11
      </p> */}
    </div>
  );
}
