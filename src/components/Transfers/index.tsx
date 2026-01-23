import Image from "next/image";
import PlayerCard from "../PlayerCard";

//TODO:
// - They need to be draggable to make substitutions (key functionality)
// - Bin to remove a player.
// - Should take a list of 15 players (with their team, name, price)

interface TransfersProps {
  size?: number;
  perspective?: number;
}

export default function Transfers({
  size = 500,
  perspective = 800,
}: TransfersProps) {
  return (
    <div
      className="mt-24 relative"
      style={{ perspective: perspective, position: "relative" }}
    >
      <PlayerCard x={0} y={0} size={size} />
      <Image
        src={"field.svg"}
        alt="Football field"
        height={size}
        width={size}
        style={{
          position: "relative",
          transform: "rotateX(45deg)",
          transformStyle: "preserve-3d",
          zIndex: 0,
        }}
      />
    </div>
  );
}
