"use client";

import { useState } from "react";
import FindAll from "../components/findAll/page"

export default function Home() {

  const [text, setText] = useState("")

  async function handleSubmit() {

    console.log(text);
    if (!text.trim()) {
        alert("Digite algo no diário.");
        return;
    }

    await fetch("/api/journal", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          text: text,
          tags: ["diario"]
      })

    });
  }

  return (
    <div className="box">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input-text"
        placeholder="Digite aqui ...."
      />

      <button onClick={handleSubmit}>
        Salvar
      </button>
      
      <FindAll />
    </div>

  );
}