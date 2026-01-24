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
    600,
    size,
    rotation,
    perspective,
  );
  const { x: rightX, y: bottomY } = mapCoordinates(
    600,
    600,
    size,
    rotation,
    perspective,
  );

  console.log(topY, bottomY);
  console.log(leftX, rightX);

  return (
    <div
      className="m-16 relative overflow-hidden"
      style={{ perspective: perspective }}
    >
      <div
        className="z-10 w-20 backdrop-blur-md absolute flex flex-col justify-between p-4"
        style={{
          top: topY,
          left: leftX,
          height: size - topY,
          width: size - 2 * leftX,
        }}
      >
        <div id="gk" className="flex justify-center">
          <PlayerCard />
        </div>
        <div id="def" className="flex justify-around px-[16px]">
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
          {/* <PlayerCard /> */}
          {/* <PlayerCard /> */}
        </div>
        <div id="mid" className="flex justify-around">
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
          {/* <PlayerCard /> */}
        </div>
        <div id="fwd" className="flex justify-around px-[64px]">
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
        </div>
      </div>
      <Image
        src={"field.svg"}
        alt="Football field"
        height={size}
        width={size}
        style={{
          position: "relative",
          transform: `rotateX(${rotation}deg)`,
          transformStyle: "preserve-3d",
          zIndex: 0,
        }}
      />
    </div>
  );
}
