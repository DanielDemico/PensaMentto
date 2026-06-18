"use client";

import { useState } from "react";
import FindAll from "@/app/findAll/page";
import FindByText from "@/app/findByText/page";
import DashboardButton from "@/components/DashboardButton";

import styles from "./page.module.css"

export default function JournalPage() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit() {
    if (!text.trim()) {
      setFeedback("Digite algo no diário!");
      setTimeout(() => setFeedback(""), 3000);
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
    setFeedback("Registro salvo com sucesso!");
    setTimeout(() => setFeedback(""), 3000);
  }

  return (
    <main className="journal-page" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
      <div className="max-w-7xl w-full flex flex-row gap-8 justify-center h-full">
        
        <section className="journal-box" style={{ flex: 1.5, maxWidth: '700px', height: '100%' }}>
          <header className="flex justify-between w-full items-center mb-4">
            <h1 className="journal-title" style={{ margin: 0 }}>Meu Diário</h1>
            <DashboardButton></DashboardButton>
          </header>
          
          <h2 className="text-xl font-bold text-[#4f4574] mb-4">Escreva um novo registro</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-text flex-1"
            placeholder="Como você está se sentindo hoje?..."
          />
          <button className="cta-button" style={{ marginTop: '1rem' }} onClick={handleSubmit}>Salvar</button>
          {feedback && (
            <p style={{ color: '#4f4574', marginTop: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
              {feedback}
            </p>
          )}
        </section>

        <aside className={styles.journalAside} style={{ flex: 1, maxWidth: '500px', height: '100%' }}>
          <section className="journal-list-section" style={{ width: '100%' }}>
            <FindAll />
          </section>

          <section className="search-section" style={{ width: '100%', marginTop: '1rem' }}>
            <FindByText />
          </section>
        </aside>

      </div>
    </main>
  );
}
