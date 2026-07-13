"use client";

import React, { useEffect, useState } from 'react'; //import react

export default function Home() { //creates home page html
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Next.js + Vercel</h1>
      <p className="mt-4 text-gray-600">API says: {message}</p> 
    </main>
  );
}
