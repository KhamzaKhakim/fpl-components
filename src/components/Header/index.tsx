import Link from "next/link";

export default function Header() {
  return (
    <div className="h-24 flex justify-end gap-8 bg-gray-100 items-center">
      <ul className="space-x-8 mx-6">
        <Link
          href="/planner"
          className="hover:underline hover:underline-offset-4"
        >
          Planner
        </Link>
        <Link
          href="/points"
          className="hover:underline hover:underline-offset-4"
        >
          Points
        </Link>
      </ul>
    </div>
  );
}
