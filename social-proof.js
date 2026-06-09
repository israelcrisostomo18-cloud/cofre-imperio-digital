(() => {
  const messages = [
    "Uma pessoa acabou de acessar esta oferta.",
    "Novo visitante visualizando a página.",
    "Alguém acabou de clicar em ver detalhes.",
    "Oferta visualizada há poucos minutos.",
    "Produto em alta agora.",
    "Página de pagamento acessada recentemente.",
    "Uma pessoa está analisando esta oferta.",
    "Novo acesso registrado na página.",
    "Visitante interessado visualizando os benefícios.",
    "Alguém acabou de clicar no botão principal.",
    "Mais uma pessoa entrou na página agora.",
    "Oferta sendo acessada neste momento.",
    "Uma pessoa está vendo os detalhes do produto.",
    "Novo visitante navegando pela oferta.",
    "Página movimentada nos últimos minutos."
  ];

  const icons = ["✓", "◉", "↗", "⌁"];
  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const region = document.createElement("div");
  region.className = "activity-toast-region";
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  document.body.appendChild(region);

  let lastMessageIndex = -1;

  const pickMessage = () => {
    let nextIndex = randomBetween(0, messages.length - 1);

    if (messages.length > 1) {
      while (nextIndex === lastMessageIndex) {
        nextIndex = randomBetween(0, messages.length - 1);
      }
    }

    lastMessageIndex = nextIndex;
    return messages[nextIndex];
  };

  const showToast = () => {
    const toast = document.createElement("div");
    const visibleFor = randomBetween(4000, 6000);
    const icon = icons[randomBetween(0, icons.length - 1)];

    toast.className = "activity-toast";
    toast.innerHTML = `
      <span class="activity-toast-icon" aria-hidden="true">${icon}</span>
      <span>
        <strong>${pickMessage()}</strong>
        <small>Atividade recente da página</small>
      </span>
    `;

    region.replaceChildren(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 320);
    }, visibleFor);

    window.setTimeout(showToast, randomBetween(8000, 12000));
  };

  window.setTimeout(showToast, randomBetween(8000, 12000));
})();
