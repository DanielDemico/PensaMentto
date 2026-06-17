"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HAPPY_ASCII = [
  "(^_^)",
  "(・∀・)",
  "(´▽｀)",
  "(⌒‿⌒)",
  "(✿◠‿◠)",
  "(*^‿^*)",
];

export default function IntroductionPage() {
  const [asciiIndex, setAsciiIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAsciiIndex((current) => (current + 1) % HAPPY_ASCII.length);
    }, 1200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="intro-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Seu diário Pessoal</h1>
          <p className="hero-ascii">{HAPPY_ASCII[asciiIndex]}</p>
          <button className="hero-button" onClick={() => router.push("/journal")}>Iniciar</button>
        </div>
      </section>
    </main>
  );
}
