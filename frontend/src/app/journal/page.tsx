"use client";

import { useState } from "react";
import FindAll from "@/app/findAll/page";
import FindByText from "@/app/findByText/page";
import DashboardButton from "@/components/DashboardButton";

import styles from "./page.module.css"

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
        <h1 className="journal-title">Escreva no seu diário</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-text"
          placeholder="Digite aqui..."
        />
        <button className="cta-button" onClick={handleSubmit}>Salvar</button>
      </section>

      <aside className={styles.journalAside}>
        <DashboardButton></DashboardButton>

        <section className="journal-list-section">
          <FindAll />
        </section>

        <hr></hr>

        <section className="search-section">
          <FindByText />
        </section>
      </aside>
    </main>
  );
}
