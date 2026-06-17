"use client";

import { useState } from "react";
import FindAll from "@/components/page";

export default function JournalPage() {
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
    <main className="journal-page">
      <section className="journal-box">
        <h1>Escreva no seu diário</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-text"
          placeholder="Digite aqui..."
        />
        <button onClick={handleSubmit}>Salvar</button>
      </section>
      <section className="journal-list-section">
        <FindAll />
      </section>
    </main>
  );
}
