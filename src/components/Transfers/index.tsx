import Image from "next/image";
import PlayerCard from "../PlayerCard";
import { mapCoordinates } from "@/src/utils/mapCoordinates";
import { createScaler } from "@/src/utils/scaler";

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

  const s = createScaler(size);

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
          <PlayerCard name="Alisson" price="5.5" team="LIV" size={size} />
        </div>

        {/* DEF */}
        <div className="flex justify-around" style={{ paddingInline: s(16) }}>
          <PlayerCard name="Frimpong" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Konate" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Van Djik" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Kerkez" price="5.5" team="LIV" size={size} />
        </div>

        {/* MID */}
        <div className="flex justify-around">
          <PlayerCard name="Sobo" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Grava" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Wirtz" price="5.5" team="LIV" size={size} />
        </div>

        {/* FWD */}
        <div className="flex justify-around" style={{ paddingInline: s(64) }}>
          <PlayerCard name="Salah" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Ekitike" price="5.5" team="LIV" size={size} />
          <PlayerCard name="Gakpo" price="5.5" team="LIV" size={size} />
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
