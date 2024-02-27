"use client";

import { data } from "@/consts/conversationContent";

export default function Home() {
  const handleClickCreateTicket = async () => {
    await fetch("/api/create-support-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-3xl">
      <button className="bg-blue-700 w-80 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-6">
        <a
          href={`https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=${process.env.REACT_APP_CLIENT_ID}&state=${process.env.REACT_APP_SECRET_ID}`}
          target="_blank"
        >
          Authorize the app
        </a>
      </button>
      <button
        className="bg-blue-700 hover:bg-gray-600 w-80 text-white font-bold py-2 px-4 rounded mt-6"
        onClick={handleClickCreateTicket}
      >
        Create Ticket ✨
      </button>
    </main>
  );
}
