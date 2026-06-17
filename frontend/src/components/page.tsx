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


  async function handleDelete(id: string) {
    const response = await fetch(`/api/journal/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.log("Erro ao deletar");
      return;
    }

    // remove da tela sem precisar buscar tudo novamente
    setRegisters((prev) =>
      prev.filter((register) => register._id.toString() !== id)
    );
  }
  
  

  return (
    <div>
      <button onClick={handleSubmit}>Buscar Diários</button>
      {registers.map((register: JournalType) => (
        <div 
          key={register._id!}
          className="register"
          >
          <p>{register._id.toString()}</p>
          <p>{register.userId}</p>
          <p>{register.text}</p>
          <p>{register.createdAt?.toString()}</p>
          <p>{register.updatedAt?.toString()}</p>
          {register.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}

          <button
            onClick={() =>
              handleDelete(register._id.toString())
            }
          >
            Apagar
          </button>
          
        </div>
      ))}
    </div>
  );
}