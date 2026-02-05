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
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import styles from "./styles.module.css";
import { createRoot } from "react-dom/client";

interface PlayerCardProps {
  size: number;
  player: Player;
  index: number;
  isLoading: boolean;
}

function Preview({ player, size }: { player: Player; size: number }) {
  const s = createScaler(size);
  const fs = s(10);

  return (
    <div
      className="relative backdrop-blur-md border border-cyan-50 rounded-md overflow-hidden"
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={
            player.position === "GK"
              ? `/gk-shirts/${player.teamShortName || "ARS"}.png`
              : `/shirts/${player.teamShortName || "ARS"}.png`
          }
          alt={player.teamShortName}
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
          className="text-center bg-white rounded-t-sm"
          style={{ fontSize: fs }}
        >
          {player.name}
        </p>
        <p className="text-center bg-gray-200" style={{ fontSize: fs }}>
          {+player.price / 10}
        </p>
      </div>
    </div>
  );
}

export default function PlayerCard({
  player,
  index,
  size,
  isLoading,
}: PlayerCardProps) {
  const s = createScaler(size);

  const fs = s(10);

  const ref = useRef<HTMLDivElement | null>(null);
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
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
          getOffset: centerUnderPointer,
          render({ container }) {
            const root = createRoot(container);

            root.render(<Preview player={player} size={size} />);

            return function cleanup() {
              root.unmount();
            };
          },
          nativeSetDragImage,
        });
      },
    });
  }, [player, index]);

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
      <div className="relative w-full h-full">
        <Image
          src={
            player.position === "GK"
              ? `/gk-shirts/${player.teamShortName || "ARS"}.png`
              : `/shirts/${player.teamShortName || "ARS"}.png`
          }
          alt={player.teamShortName}
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
          className=" text-center bg-white rounded-t-sm"
          style={{ fontSize: fs }}
        >
          {player.name}
        </p>
        <p className="text-center bg-gray-200" style={{ fontSize: fs }}>
          {+player.price / 10}
        </p>
      </div>
    </div>
  );
}
