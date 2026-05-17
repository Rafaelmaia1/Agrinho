/* Agrinho — scripts úteis: acessibilidade, leitura de página e pequenas melhorias interativas */

(function () {
  "use strict";

  // Estado e persistência local
  const storage = window.localStorage;
  const state = {
    font: parseInt(storage.getItem("agrinho-font") || "100", 10),
    dark: storage.getItem("agrinho-dark") === "true",
  };

  // Aplicador de Escala de Fonte
  function applyFont() {
    const scale = state.font / 100;
    document.documentElement.style.fontSize = 16 * scale + "px";
  }

  // Aplicador de Modo Claro/Escuro Puro e Eficiente
  function applyDark() {
    if (state.dark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }

  // Assistência de Voz (Leitura de Página)
  let utterance = null;
  function speakPage() {
    if (!("speechSynthesis" in window)) {
      alert("Síntese de voz não suportada neste navegador.");
      return;
    }
    stopSpeech();

    // Captura apenas os textos relevantes dos artigos
    const nodes = document.querySelectorAll(
      "article h2, article h3, article p, article li",
    );
    const text = Array.from(nodes)
      .map((n) => n.innerText)
      .join("\n");

    if (!text.trim()) return;

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1.1; // Leitura ligeiramente dinâmica
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      utterance = null;
    }
  }

  // Criação Dinâmica da Barra de Ferramentas de Acessibilidade
  function createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "a11y-toolbar";
    toolbar.setAttribute("role", "region");
    toolbar.setAttribute("aria-label", "Controles de acessibilidade");

    toolbar.innerHTML = `
      <button class="a11y-btn" id="a11y-decrease" title="Diminuir fonte">A-</button>
      <button class="a11y-btn" id="a11y-reset" title="Redefinir fonte">A</button>
      <button class="a11y-btn" id="a11y-increase" title="Aumentar fonte">A+</button>
      <button class="a11y-btn" id="a11y-dark" title="Alternar modo claro/escuro">🌙</button>
      <button class="a11y-btn" id="a11y-speak" title="Ler a página">🔊</button>
      <button class="a11y-btn" id="a11y-stop" title="Parar leitura">■</button>
    `;

    document.body.appendChild(toolbar);

    // Event Listeners das Ferramentas
    toolbar.querySelector("#a11y-decrease").addEventListener("click", () => {
      state.font = Math.max(80, state.font - 10);
      storage.setItem("agrinho-font", state.font);
      applyFont();
    });

    toolbar.querySelector("#a11y-increase").addEventListener("click", () => {
      state.font = Math.min(140, state.font + 10);
      storage.setItem("agrinho-font", state.font);
      applyFont();
    });

    toolbar.querySelector("#a11y-reset").addEventListener("click", () => {
      state.font = 100;
      storage.setItem("agrinho-font", state.font);
      applyFont();
    });

    toolbar.querySelector("#a11y-dark").addEventListener("click", () => {
      state.dark = !state.dark;
      storage.setItem("agrinho-dark", state.dark);
      applyDark();
    });

    toolbar.querySelector("#a11y-speak").addEventListener("click", speakPage);
    toolbar.querySelector("#a11y-stop").addEventListener("click", stopSpeech);
  }

  // Inicialização ao Carregar o DOM
  document.addEventListener("DOMContentLoaded", () => {
    // Configura o ano dinamicamente no rodapé se o elemento existir
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    applyFont();
    applyDark();
    createToolbar();
  });
})();
