"use client";

import { useUser } from "../context/user/useUser";

export default function Home() {
  const { id, setId } = useUser();
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    if (data?.id && typeof data?.id == "string") {
      localStorage.setItem("id", data.id);
      setId(data.id);
      console.log("Update the id");
    }
  }

  function CurrentId({ id }: { id: string }) {
    return (
      <div className="flex flex-col">
        <p>Your current id: {id}</p>
        <button
          type="button"
          className="border"
          onClick={() => {
            setId(null);
            localStorage.removeItem("id");
          }}
        >
          remove id
        </button>
      </div>
    );
  }

  return (
    <div className="mx-20 my-8 flex justify-center">
      <div className="flex flex-col">
        {id && <CurrentId id={id} />}
        <form onSubmit={onSubmit}>
          <div className="flex flex-col">
            {id ? <h1>Update your id:</h1> : <h1>Please enter your id:</h1>}
            <input
              name="id"
              type="number"
              className="border rounded-lg min-w-80 px-4 py-1 mt-2"
            />
            <button className="m-8 border">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
