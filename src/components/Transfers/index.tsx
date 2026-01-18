import Image from "next/image";

//TODO:
// - They need to be draggable to make substitutions (key functionality)
// - Bin to remove a player.
// - Should take a list of 15 players (with their team, name, price)

export default function Transfers() {
  return (
    <div
      className="mt-24 flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <Image
        src={"field.svg"}
        alt="Football field"
        height={500}
        width={500}
        style={{
          transform: "rotateX(25deg)",
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
}
