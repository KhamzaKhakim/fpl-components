import { mapCoordinates } from "@/src/utils/mapCoordinates";

interface PlayerCardProps {
  x: number;
  y: number;
  size: number;
}

export default function PlayerCard(props: PlayerCardProps) {
  const { x, y } = mapCoordinates(props.x, props.y, props.size, 45, 1000);

  return (
    <div
      className="h-20 aspect-3/4 bg-amber-300 absolute -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    ></div>
  );
}
