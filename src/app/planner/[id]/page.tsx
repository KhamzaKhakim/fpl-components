"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import store from "store2";

import TransferField from "@/src/components/fields/TransferField";
import { TransferPlan } from "@/src/elysia/modules/transfers/model";
import { createScaler } from "@/src/utils/scaler";

export default function PlanPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<TransferPlan[] | null>(null);

  const [gw, setGw] = useQueryState("gw", parseAsInteger);

  useEffect(() => {
    const plan = store.get(`plans.${id}`) as TransferPlan[];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(plan);
  }, [id]);

  useEffect(() => {
    if (!gw && data) setGw(data[0].gw);
  }, [data, gw, setGw]);

  //TODO: Create good loading page, even though this might never run in this case.
  if (!data) {
    return <h1>Loading...</h1>;
  }

  const gwData = gw ? (data.find((d) => d.gw == gw) ?? data[0]) : data[0];

  const createNextGw = () => {
    setData((prev) => {
      if (!prev || prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      const next = [...prev, { ...last, gw: last.gw + 1 }];
      return next;
    });
  };

  return (
    <div className="mx-16 my-4">
      <div className="flex justify-center">
        <div>
          <GameweekChooser
            size={600}
            data={data}
            currGw={gw ?? undefined}
            setGw={setGw}
            createNextGw={createNextGw}
          />
          <TransferField
            size={600}
            data={gwData}
            onChange={(updatedGwData) => {
              setData((d) => {
                if (!d) return d;

                const updated = d.map((item) =>
                  item.gw === updatedGwData.gw ? updatedGwData : item,
                );

                store.set(`plans.${id}`, updated);
                return updated;
              });
            }}
            isLoading={false}
          />
        </div>
        <div>Table</div>
        {/* {response?.data && <Plans response={response?.data} />} */}
      </div>
    </div>
  );
}

function GameweekChooser({
  currGw = 0,
  createNextGw,
  data,
  size = 600,
  setGw,
}: {
  currGw?: number;
  size?: number;
  data: TransferPlan[];
  setGw: (value: number) => Promise<URLSearchParams>;
  createNextGw: () => void;
}) {
  const s = createScaler(size);

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        aria-label="Previous gameweek"
        disabled={currGw == data[0].gw}
        onClick={() => setGw(currGw - 1)}
        className={`
            p-2 rounded-lg transition
            ${
              currGw == data[0].gw
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-200"
            }
            `}
      >
        <Image
          src="/icons/arrow-left.svg"
          alt="Prev"
          width={s(16)}
          height={s(16)}
        />
      </button>

      <div
        className="flex flex-col justify-center items-center bg-gray-200/50 text-gray-900 transition"
        style={{ width: s(88), height: s(88), borderRadius: s(12) }}
      >
        <p className="text-center text-sm font-medium">{data.length}</p>
        <p className="text-center text-xs text-gray-600">gws</p>
      </div>

      <button
        aria-label="Next gameweek"
        disabled={currGw == 38}
        onClick={() => {
          const nextGw = data.find((d) => d.gw == currGw + 1);

          if (!nextGw) {
            createNextGw();
          }

          setGw(currGw + 1);
        }}
        className={`
              p-2 rounded-lg transition
              ${
                currGw == 38
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }
            `}
      >
        <Image
          src="/icons/arrow-right.svg"
          alt="Next"
          width={s(16)}
          height={s(16)}
        />
      </button>
    </div>
  );
}
