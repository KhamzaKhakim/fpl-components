"use client";
import { CirclePlus } from "lucide-react";

import { createScaler } from "@/src/utils/scaler";

interface PlayerCardProps {
  size: number;
  index: number;
}

export default function EmptyCard({ size }: PlayerCardProps) {
  const s = createScaler(size);
  //   const src =
  //     player.position === "GK"
  //       ? `/gk-shirts/${player.teamShortName || "ARS"}.png`
  //       : `/shirts/${player.teamShortName || "ARS"}.png`;

  const fs = s(10);

  //   const ref = useRef<HTMLDivElement | null>(null);
  //   const [dragging, setDragging] = useState(false);
  //   const [isDraggedOver, setIsDraggedOver] = useState(false);
  //   const [previewPosition, setPreviewPosition] = useState<{
  //     x: number;
  //     y: number;
  //   } | null>(null);

  //   useEffect(() => {
  //     const el = ref.current;
  //     if (!el) return;

  //     return draggable({
  //       element: el,
  //       onDragStart: ({ location }) => {
  //         setDragging(true);

  //         preventUnhandled.start();

  //         const { input } = location.initial;

  //         setPreviewPosition({
  //           x: input.clientX,
  //           y: input.clientY,
  //         });
  //       },
  //       onDrag: ({ location }) => {
  //         const { input } = location.current;

  //         setPreviewPosition({
  //           x: input.clientX,
  //           y: input.clientY,
  //         });

  //         if (document.body.style.cursor !== "grabbing") {
  //           document.body.style.setProperty("cursor", "grabbing", "important");
  //         }
  //       },
  //       onDrop: () => {
  //         setDragging(false);
  //         document.body.style.cursor = "";

  //         preventUnhandled.stop();

  //         setPreviewPosition(null);
  //       },
  //       getInitialData: () => ({ player, index }),
  //       onGenerateDragPreview: ({ nativeSetDragImage }) => {
  //         disableNativeDragPreview({ nativeSetDragImage });
  //       },
  //     });
  //   }, [player, index]);

  //   useEffect(() => {
  //     const el = ref.current;
  //     if (!el) return;

  //     return dropTargetForElements({
  //       element: el,
  //       onDragEnter: () => setIsDraggedOver(true),
  //       canDrop: () => {
  //         return canDrop;
  //       },
  //       onDragLeave: () => setIsDraggedOver(false),
  //       onDrop: () => {
  //         setIsDraggedOver(false);
  //       },
  //       getData: () => ({ player, index }),
  //     });
  //   }, [player, index, isLoading, canDrop]);

  //   if (isLoading) {
  //     return (
  //       <Skeleton
  //         className="rounded-md z-30 relative"
  //         style={{ height: s(96), aspectRatio: "3 / 4" }}
  //       />
  //     );
  //   }

  return (
    <div
      className={`relative select-none backdrop-blur-md border border-cyan-50 z-30 cursor-grab
                  rounded-md overflow-hidden transition-opacity duration-300 ease-in-out
                `}
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
      }}
      //   ref={ref}
      //   key={`${player.name}-${player.team}`}
    >
      <div className="relative w-full h-[70%] flex justify-center items-center">
        <CirclePlus size={s(46)} className="text-gray-200" />
      </div>
      <div className="h-[30%] absolute bottom-0 w-full">
        <p
          className=" text-center bg-gray-200 rounded-t-sm line-clamp-2"
          style={{ fontSize: fs }}
        >
          Add player
        </p>
      </div>
    </div>
  );
}
