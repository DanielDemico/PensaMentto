"use client";

import { JournalType } from "@/models/Journal";
import { useState } from "react";

export default function FindAll() {
  const [registers, setRegisters] = useState<JournalType[]>([]);

  async function handleSubmit() {
    const response = await fetch("/api/journal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setRegisters(data);
  }

  return (
    <div>
      <button onClick={handleSubmit}>Buscar Diários</button>
      {registers.map((register: JournalType) => (
        <div 
          key={register._id?.toString()}
          className="register"
          >
          <p>{register.userId}</p>
          <p>{register.text}</p>
          <p>{register.createdAt?.toString()}</p>
          <p>{register.updatedAt?.toString()}</p>
          {register.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  );
}