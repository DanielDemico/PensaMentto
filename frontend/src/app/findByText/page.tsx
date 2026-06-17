"use client";

import { useState } from "react";

export default function FindByText() {
  const [text, setText] = useState("");

  async function handleSubmit() {
    if (!text.trim()) {
      alert("Digite algo no diário.");
      return;
    }

    await fetch("/api/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        tags: [],
      }),
    });

    setText("");
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
        <button onClick={handleSubmit}>Procurar</button>
      </section>

      <hr></hr>

      <section className="journal-list-section">
      </section>
    </div>
  );
}
