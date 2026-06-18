"use client";

import { JournalType } from "@/models/Journal";
import { useState } from "react";

export type FindAllHandle = {
  handleFindAll: () => Promise<void>;
};

export default function FindAll() {

  
  const [registers, setRegisters] = useState<JournalType[]>([]);
  const [newTexts, setTexts] = useState<Record<string, string>>({});

  async function handleFindAll() {
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

  async function handleUpdate(id: string) {
    const newText = newTexts[id]
    
    if (!newText.trim()) {
      alert("Digite algo no diário.");
      return;
    }

    await fetch(`/api/journal/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newText: newText,
        tags: [],
      }),
    });
  
  }

  return (
    <div>
      <button onClick={handleFindAll} className="cta-button">Buscar Diários</button>
      {registers.map((register: JournalType) => (
        <div 
          key={register._id!}
          className="register"
          >
          <p>ObjectId: {register._id.toString()}</p>
          <p>Passagem: {register.text}</p>
          <p>Criado em: {register.createdAt?.toString()}</p>
          <p>Editado em: {register.updatedAt?.toString()}</p>
          <span>Tags: </span>
          {register.tags?.map((tag) => (
            <span key={tag}>{tag}, </span>
          ))}

          <br></br>

          <div>
            <button
              onClick={() =>
                handleDelete(register._id.toString())
              }
            >
              Apagar
            </button>

            <br></br>
            
            <textarea
              value={newTexts[register._id.toString()] || ""}
              onChange={(e) =>
                setTexts((prev) => ({
                  ...prev,
                  [register._id.toString()]: e.target.value,
                }))}
              className="input-text"
              key={register._id!}
            ></textarea>

            <br></br>

            <button
              onClick={() =>
                handleUpdate(register._id.toString())
              }
            >
              Atualizar
            </button>

          </div>
          
        </div>
      ))}
    </div>
  );
}
