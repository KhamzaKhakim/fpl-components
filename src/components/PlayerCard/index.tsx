interface PlayerCardProps {
  size: number;
}

export default function PlayerCard({ size }: PlayerCardProps) {
  const BASE_SIZE = 600;
  const s = (v: number) => (v / BASE_SIZE) * size;

  return (
    <div
      className="bg-amber-300 border z-30 rounded-md"
      style={{
        height: s(96), // h-24
        aspectRatio: "3 / 4",
        transform: `translateY(-${s(48)}px)`,
      }}
    />
  );
}
