import Image from "next/image";

export default function Points() {
  return (
    <div>
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
            transform: "rotateX(45deg)",
            transformStyle: "preserve-3d",
          }}
        />
      </div>
    </div>
  );
}
