"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

import { useUser } from "../context/user/useUser";

export default function Home() {
  const { id, setId } = useUser();

  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    if (data?.id && typeof data?.id == "string") {
      localStorage.setItem("id", data.id);
      setId(data.id);
      inputRef.current!.value = "";
    }
  }

  return (
    <div className="mx-20 my-8 flex justify-center">
      <div className="flex flex-col">
        {id && (
          <CurrentId
            id={id}
            clearId={() => {
              localStorage.removeItem("id");
              setId(null);
            }}
          />
        )}
        <form onSubmit={onSubmit}>
          <div className="flex flex-col">
            {id ? <h1>Update your id:</h1> : <h1>Please enter your id:</h1>}
            <input
              ref={inputRef}
              name="id"
              type="number"
              className="border rounded-lg min-w-80 px-4 py-1 mt-2"
            />
            <Button className="m-8 border">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CurrentId({ id, clearId }: { id: string; clearId: () => void }) {
  return (
    <div className="flex flex-col">
      <p>Your current id: {id}</p>
      <Button
        type="button"
        className="border"
        onClick={() => {
          clearId();
        }}
      >
        remove id
      </Button>
    </div>
  );
}
