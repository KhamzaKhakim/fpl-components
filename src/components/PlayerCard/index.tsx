import { createScaler } from "@/src/utils/scaler";

interface PlayerCardProps {
  size: number;
  name: string;
  team: string;
  price: string;
}

export default function PlayerCard({ name, price, size }: PlayerCardProps) {
  const s = createScaler(size);

  const fs = s(10);

  return (
    <div
      className="backdrop-blur-md border border-cyan-50 z-30 rounded-md overflow-hidden"
      style={{
        height: s(96),
        aspectRatio: "3 / 4",
        transform: `translateY(-${s(48)}px)`,
      }}
    >
      <div className="h-[70%]"></div>
      <p
        className="h-[15%] text-center bg-white rounded-t-sm select-none"
        style={{ fontSize: fs }}
      >
        {name}
      </p>
      <p
        className="h-[15%] text-center bg-gray-200 select-none"
        style={{ fontSize: fs }}
      >
        {price}
      </p>
      {/* <p
        className="h-[15%] text-center bg-blue-950 text-white"
        style={{ fontSize: fs }}
      >
        11
      </p> */}
    </div>
  );
}
