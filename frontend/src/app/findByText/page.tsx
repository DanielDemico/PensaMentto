"use client";

import { JournalType } from "@/models/Journal";
import { useState } from "react";

// type Journal = {
//   _id: string;
//   text: string;
//   tags: string[];
// };

export default function FindByText() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<JournalType[]>([]);
//   const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) {
      alert("Digite algo no campo de pesquisa");
      return;
    }

    try {
    //   setLoading(true);

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
    // } finally {
    //   setLoading(false);
    // }
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

        <button onClick={handleSubmit}>
          {loading ? "Buscando..." : "Procurar"}
        </button>
      </section>

      <hr />

      <section className="journal-list-section">
        {results.length === 0 && !loading && (
          <p>Nenhum resultado encontrado</p>
        )}

        {results.map((item) => (
          <div key={item._id} className="journal-item">
            <p>{item.text}</p>

            {item.tags?.length > 0 && (
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}