import { mapCoordinates } from "@/src/utils/mapCoordinates";

interface PlayerCardProps {
  x: number;
  y: number;
  size: number;
}

export default function PlayerCard(props: PlayerCardProps) {
  const { formattedX, formattedY } = formatCoordinates(props);

  const { x, y } = mapCoordinates({
    x: props.x,
    y: props.y,
    size: props.size,
  });

  return (
    <div
      className="h-20 aspect-3/4 bg-amber-300 absolute -translate-x-1/2 -translate-y-full z-10"
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    ></div>
  );
}

function formatCoordinates(props: PlayerCardProps) {
  return { formattedX: props.x, formattedY: Math.abs(props.size - props.y) };
}
