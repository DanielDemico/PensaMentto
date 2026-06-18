"use client";

import { JournalType } from "@/models/Journal";
import { useState } from "react";

export type FindAllHandle = {
  handleFindAll: () => Promise<void>;
};

export default function FindAll() {

  const [registers, setRegisters] = useState<JournalType[]>([]);
  const [newTexts, setTexts] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [showRegisters, setShowRegisters] = useState(false);

  function showFeedback(id: string, msg: string) {
    setFeedbacks(prev => ({ ...prev, [id]: msg }));
    setTimeout(() => {
      setFeedbacks(prev => ({ ...prev, [id]: "" }));
    }, 3000);
  }

  async function handleToggleFindAll() {
    if (showRegisters) {
      setShowRegisters(false);
      return;
    }

    const response = await fetch("/api/journal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setRegisters(data);
    setShowRegisters(true);
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

    if (!newText || !newText.trim()) {
      showFeedback(id, "O texto não pode ser vazio.");
      return;
    }

    const res = await fetch(`/api/journal/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newText: newText,
        tags: [],
      }),
    });

    if (res.ok) {
      showFeedback(id, "Atualizado com sucesso!");
      // Optionally update the local state so the view reflects the change without a fetch
      setRegisters(prev => prev.map(r => r._id.toString() === id ? { ...r, text: newText, updatedAt: new Date() } : r));
    } else {
      showFeedback(id, "Erro ao atualizar.");
    }
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={handleToggleFindAll} className="cta-button" style={{ marginBottom: '1.5rem' }}>
        {showRegisters ? "Esconder Diários" : "Buscar Diários"}
      </button>
      {showRegisters && registers.map((register: JournalType) => (
        <div
          key={register._id!}
          className="register"
        >
          <p><strong>ObjectId:</strong> {register._id.toString()}</p>
          <p><strong>Passagem:</strong> {register.text}</p>
          <p><strong>Criado em:</strong> {new Date(register.createdAt!).toLocaleString('pt-BR')}</p>
          <p><strong>Editado em:</strong> {register.updatedAt ? new Date(register.updatedAt).toLocaleString('pt-BR') : '-'}</p>
          
          {register.tags && register.tags.length > 0 && (
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Tags: </strong>
              {register.tags.map((tag) => (
                <span key={tag} style={{ background: '#e9e3ff', padding: '0.2rem 0.5rem', borderRadius: '12px', marginRight: '0.5rem', fontSize: '0.85rem' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="register-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid #e9e3ff', paddingTop: '1rem' }}>
            <button
              className="cta-button"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#ef4444' }}
              onClick={() =>
                handleDelete(register._id.toString())
              }
            >
              Apagar
            </button>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <textarea
                value={newTexts[register._id.toString()] || ""}
                onChange={(e) =>
                  setTexts((prev) => ({
                    ...prev,
                    [register._id.toString()]: e.target.value,
                  }))}
                className="input-text"
                style={{ minHeight: '80px', padding: '1rem' }}
                placeholder="Novo texto..."
                key={register._id!}
              ></textarea>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  className="cta-button"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  onClick={() =>
                    handleUpdate(register._id.toString())
                  }
                >
                  Atualizar
                </button>
                {feedbacks[register._id.toString()] && (
                  <span style={{ color: '#4f4574', fontWeight: 'bold' }}>
                    {feedbacks[register._id.toString()]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
