"use client";
import { createScaler } from "@/src/utils/scaler";
import { useEffect, useRef, useState } from "react";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Player } from "../Transfers";
import { Skeleton } from "@/components/ui/skeleton";
import { createPortal } from "react-dom";

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
  const src =
    player.position === "GK"
      ? `/gk-shirts/${player.teamShortName || "ARS"}.png`
      : `/shirts/${player.teamShortName || "ARS"}.png`;

  const fs = s(10);

  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      onDragStart: ({ location }) => {
        setDragging(true);

        preventUnhandled.start();

        const { input } = location.initial;

        setPreviewPosition({
          x: input.clientX,
          y: input.clientY,
        });
      },
      onDrag: ({ location }) => {
        const { input } = location.current;

        setPreviewPosition({
          x: input.clientX,
          y: input.clientY,
        });

        if (document.body.style.cursor !== "grabbing") {
          document.body.style.setProperty("cursor", "grabbing", "important");
        }
      },
      onDrop: () => {
        setDragging(false);
        document.body.style.cursor = "";

        preventUnhandled.stop();

        setPreviewPosition(null);
      },
      getInitialData: () => ({ player, index }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
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
      className={`relative select-none backdrop-blur-md border border-cyan-50 z-30 cursor-grab
                  rounded-md overflow-hidden ${dragging && "opacity-20"} ${isDraggedOver && "bg-cyan-400/40 ring-4 ring-cyan-300/60"}`}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      ref={ref}
      key={`${player.name}-${player.team}`}
    >
      <div className="relative w-full h-full">
        <img
          src={src}
          alt={player.teamShortName}
          draggable={false}
          className="object-contain w-full h-full"
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
      {dragging &&
        previewPosition &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
              pointerEvents: "none",
              zIndex: 1000,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Preview player={player} size={size} />
          </div>,
          document.body,
        )}
    </div>
  );
}

function Preview({ player, size }: { player: Player; size: number }) {
  const s = createScaler(size);
  const fs = s(10);
  const src =
    player.position === "GK"
      ? `/gk-shirts/${player.teamShortName || "ARS"}.png`
      : `/shirts/${player.teamShortName || "ARS"}.png`;

  return (
    <div
      className="relative backdrop-blur-md border border-cyan-50 rounded-md overflow-hidden"
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
    >
      <div className="relative w-full h-full">
        <img
          src={src}
          alt={player.teamShortName}
          draggable={false}
          className="object-contain w-full h-full"
          decoding="sync"
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
