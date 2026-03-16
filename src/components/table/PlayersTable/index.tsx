import { PlayerType } from "@/src/elysia/modules/players/model";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function PlayersTable({ data }: { data: PlayerType[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
