"use client";

export default function Home() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log("submitted");
    console.log(data);
  }

  return (
    <div className="mx-20 my-8 flex justify-center">
      <form onSubmit={onSubmit}>
        <h1>Please enter your id:</h1>
        <input
          name="id"
          className="border rounded-lg min-w-80 px-4 py-1 mt-2"
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
