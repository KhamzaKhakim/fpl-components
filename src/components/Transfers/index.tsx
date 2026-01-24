import Image from "next/image";
import PlayerCard from "../PlayerCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";

//TODO:
// - They need to be draggable to make substitutions (key functionality)
// - Bin to remove a player.
// - Should take a list of 15 players (with their team, name, price)

interface TransfersProps {
  size?: number;
  perspective?: number;
  rotation?: number;
}

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

  const BASE_SIZE = 600;
  const s = (v: number) => (v / BASE_SIZE) * size;

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
          top: topY,
          left: leftX,
          height: size - topY,
          width: size - 2 * leftX,
          padding: s(16),
          paddingBottom: s(64),
        }}
      >
        {/* GK */}
        <div className="flex justify-center">
          <PlayerCard size={size} />
        </div>

        {/* DEF */}
        <div className="flex justify-around" style={{ paddingInline: s(16) }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <PlayerCard key={i} size={size} />
          ))}
        </div>

        {/* MID */}
        <div className="flex justify-around">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlayerCard key={i} size={size} />
          ))}
        </div>

        {/* FWD */}
        <div className="flex justify-around" style={{ paddingInline: s(64) }}>
          <PlayerCard size={size} />
          <PlayerCard size={size} />
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
