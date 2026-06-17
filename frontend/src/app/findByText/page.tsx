"use client";

import { JournalType } from "@/models/Journal";
import { useState } from "react";

export default function FindByText() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<JournalType[]>([]);
  const [newTexts, setTexts] = useState<Record<string, string>>({});
  const [registers, setRegisters] = useState<JournalType[]>([]);

  async function handleSubmit() {
    if (!text.trim()) {
      alert("Digite algo no campo de pesquisa");
      return;
    }

    try {
      const res = await fetch(
        `/api/journal/search?text=${encodeURIComponent(text)}`
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data = await res.json();
      setResults(data);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Erro na busca");
    }
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
    <div className="journal-page">
      <section className="journal-box">
        <h1>Procure por texto</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-text"
          placeholder="Digite aqui..."
        />

        <button 
            onClick={handleSubmit}
        >
           Procurar
        </button>
      </section>

      <hr />

      <section className="journal-list-section">
        {results.map((item) => (
            <div key={item._id} className="register">
                <p>ObjectId: {item._id}</p>
                <p>Passagem: {item.text}</p>
                <p>Criado em: {item.createdAt?.toString()}</p>
                <p>Editado em: {item.updatedAt?.toString()}</p>

                {item.tags?.length > 0 && (
                <div className="tags">
                    {item.tags.map((tag) => (
                    <span key={tag}>{tag}, </span>
                    ))}
                </div>
                )}

                <div>
                    <button
                    onClick={() =>
                        handleDelete(item._id.toString())
                    }
                    >
                    Apagar
                    </button>

                    <br></br>
                    
                    <textarea
                    value={newTexts[item._id.toString()] || ""}
                    onChange={(e) =>
                        setTexts((prev) => ({
                        ...prev,
                        [item._id.toString()]: e.target.value,
                        }))}
                    className="input-text"
                    key={item._id!}
                    ></textarea>

                    <br></br>

                    <button
                    onClick={() =>
                        handleUpdate(item._id.toString())
                    }
                    >
                    Atualizar
                    </button>

                </div>
            </div>
        ))}
      </section>

      <br></br>

    </div>
  );
}