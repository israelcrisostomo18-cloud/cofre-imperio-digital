// EDITE AQUI: troque estes placeholders pelos links finais da sua operação.
const CONFIG = {
  checkoutUrl: "https://pay.hotmart.com/R106118031H?checkoutMode=10",
  whatsappUrl: "https://wa.me/message/32R7UJIK7H4HB1",
  supportUrl: "https://wa.me/message/32R7UJIK7H4HB1",
};

const PRODUCT_PIXEL_DATA = {
  content_name: "Cofre Império Digital",
  content_category: "Produto Digital",
  value: 47.9,
  currency: "BRL"
};

const WHATSAPP_PIXEL_DATA = {
  content_name: "Cofre Império Digital",
  content_category: "Atendimento WhatsApp"
};

const trackMetaEvent = (eventName, params, logMessage) => {
  if (typeof window.fbq !== "function") return;

  window.fbq("track", eventName, params);
  console.info(logMessage);
};

const QUIZ_COMPLETED_KEY = "cofreImperioDigitalQuizCompleted";

const unlockLandingPage = () => {
  document.body.classList.remove("quiz-locked");
  document.body.classList.add("quiz-completed");
};

const lockLandingPage = () => {
  document.body.classList.add("quiz-locked");
  document.body.classList.remove("quiz-completed");
  window.scrollTo(0, 0);
};

try {
  if (window.localStorage.getItem(QUIZ_COMPLETED_KEY) === "true") {
    unlockLandingPage();
  } else {
    lockLandingPage();
  }
} catch (error) {
  lockLandingPage();
}

document.querySelectorAll("[data-checkout-link]").forEach((link) => {
  link.href = CONFIG.checkoutUrl;
  if (link.dataset.pixelCheckoutBound === "true") return;

  link.dataset.pixelCheckoutBound = "true";
  link.addEventListener("click", () => {
    trackMetaEvent(
      "InitiateCheckout",
      PRODUCT_PIXEL_DATA,
      "Meta Pixel InitiateCheckout disparado"
    );
  });
});

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.href = CONFIG.whatsappUrl;
});

document.querySelectorAll("[data-support-link]").forEach((link) => {
  link.href = CONFIG.supportUrl;
});

document
  .querySelectorAll('a[href^="https://wa.me/"], [data-whatsapp-link], [data-support-link]')
  .forEach((link) => {
    if (link.dataset.pixelLeadBound === "true") return;

    link.dataset.pixelLeadBound = "true";
    link.addEventListener("click", () => {
      trackMetaEvent("Lead", WHATSAPP_PIXEL_DATA, "Meta Pixel Lead disparado");
    });
  });

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  const closeMenu = () => {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  };

  const openMenu = () => {
    navToggle.classList.add("is-open");
    navLinks.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fechar menu");
  };

  navToggle.addEventListener("click", () => {
    if (navLinks.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

const quiz = document.querySelector("[data-quiz]");

if (quiz) {
  const steps = Array.from(quiz.querySelectorAll("[data-quiz-step]"));
  const startScreen = quiz.querySelector("[data-quiz-start-screen]");
  const startButton = quiz.querySelector("[data-quiz-start]");
  const nameInput = quiz.querySelector("[data-quiz-name-input]");
  const nameNext = quiz.querySelector("[data-quiz-name-next]");
  const loading = quiz.querySelector("[data-quiz-loading]");
  const result = quiz.querySelector("[data-quiz-result]");
  const resultTitle = quiz.querySelector("[data-quiz-result-title]");
  const resultMessage = quiz.querySelector("[data-quiz-result-message]");
  const resultLink = quiz.querySelector("[data-quiz-result-link]");
  const progressFill = quiz.querySelector("[data-quiz-progress]");
  const progressLabel = quiz.querySelector("[data-quiz-progress-label]");
  const scores = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0
  };
  const fallbackName = "você";
  let quizName = fallbackName;
  let currentStep = -1;

  const resultMap = {
    A: {
      title: "{nome}, seu diagnóstico está pronto",
      button: "Ver meu acesso recomendado",
      html: `
        <p>Pelas suas respostas, seu perfil mostra que você está em uma fase de começo, mas não quer começar de qualquer jeito.</p>
        <p>Você quer entrar no digital com mais clareza, mas ainda sente falta de um caminho, de ideias e de uma estrutura inicial.</p>
        <p>O seu maior bloqueio não parece ser falta de vontade. O que falta é um ponto de partida mais organizado.</p>
        <p>Você provavelmente já percebeu que começar do zero absoluto é difícil, principalmente quando você não sabe o que postar, o que estudar, que nicho escolher ou qual material usar primeiro.</p>
        <p>Por isso, o seu perfil combina com uma estrutura que te ajude a enxergar possibilidades, acessar materiais prontos, estudar novas áreas e começar com mais direção.</p>
        <div class="quiz-result-panel"><strong>Seu principal bloqueio</strong><span>Falta de clareza e ponto de partida.</span></div>
        <div class="quiz-result-panel"><strong>O que mais pode te ajudar agora</strong><span>Um acervo organizado com conteúdos, cursos, ideias, materiais e referências para você parar de depender apenas da tentativa e erro.</span></div>
        <p>{nome}, veja a explicação da página para entender como o Cofre Império Digital pode funcionar como uma base inicial para quem quer começar no digital com mais estrutura.</p>
      `
    },
    B: {
      title: "{nome}, seu diagnóstico está pronto",
      button: "Ver meu acesso recomendado",
      html: `
        <p>Pelas suas respostas, seu perfil combina com quem quer ganhar dinheiro no digital usando conteúdo, divulgação e venda como afiliado.</p>
        <p>Você talvez já tenha tentado vender alguma coisa, postar conteúdo ou divulgar algum produto, mas sentiu que faltava constância, material e direção.</p>
        <p>Esse é um ponto comum: muita gente não para por falta de vontade. Para porque não sabe o que postar, não tem criativos, não tem vídeos, não tem ideias e acaba ficando travada.</p>
        <p>Para o seu momento, o caminho mais inteligente é ter materiais que possam servir como base para criar posts, divulgar produtos, testar nichos e melhorar sua comunicação.</p>
        <div class="quiz-result-panel"><strong>Seu principal bloqueio</strong><span>Falta de conteúdo, constância e material para divulgar.</span></div>
        <div class="quiz-result-panel"><strong>O que mais pode te ajudar agora</strong><span>Vídeos, criativos, referências, conteúdos prontos, materiais por nicho e ideias para adaptar.</span></div>
        <p>{nome}, veja a explicação da página para entender como o Cofre Império Digital pode te ajudar a ter mais material na mão para divulgar, postar e vender com mais consistência.</p>
      `
    },
    C: {
      title: "{nome}, seu diagnóstico está pronto",
      button: "Ver meu acesso recomendado",
      html: `
        <p>Pelas suas respostas, seu perfil mostra interesse em criar ou melhorar uma oferta própria.</p>
        <p>Você talvez queira montar um produto digital, criar uma página, vender um material, organizar uma entrega ou usar PLRs como base para uma oferta.</p>
        <p>Esse caminho tem potencial, mas também exige estrutura.</p>
        <p>Muita gente trava porque tenta criar tudo do zero: nome, conteúdo, promessa, material, página, criativos e comunicação.</p>
        <p>O seu perfil combina com uma base de materiais que possa servir como referência para montar, adaptar e estruturar uma oferta com mais velocidade.</p>
        <div class="quiz-result-panel"><strong>Seu principal bloqueio</strong><span>Falta de base para transformar ideias em uma oferta vendável.</span></div>
        <div class="quiz-result-panel"><strong>O que mais pode te ajudar agora</strong><span>PLRs, cursos, materiais digitais, referências, criativos, conteúdos por nicho e arquivos que possam ser usados como ponto de partida.</span></div>
        <p>{nome}, veja a explicação da página para entender como o Cofre Império Digital pode servir como base para montar ofertas, criar produtos e organizar materiais digitais.</p>
      `
    },
    D: {
      title: "{nome}, seu diagnóstico está pronto",
      button: "Ver meu acesso recomendado",
      html: `
        <p>Pelas suas respostas, seu perfil mostra que você valoriza conhecimento, aprendizado e acesso a conteúdos de várias áreas.</p>
        <p>Você não quer apenas postar ou vender qualquer coisa. Você quer ter uma base maior para aprender, entender possibilidades e transformar conhecimento em ação.</p>
        <p>Esse perfil é forte porque quem aprende mais consegue enxergar mais caminhos: afiliado, produtor, conteúdo, nichos, serviços, ofertas e estratégias.</p>
        <p>O seu bloqueio talvez não seja falta de vontade, mas falta de acesso a uma estrutura ampla, organizada e com materiais suficientes para estudar, adaptar e executar.</p>
        <div class="quiz-result-panel"><strong>Seu principal bloqueio</strong><span>Falta de conhecimento organizado e acesso a materiais de várias áreas.</span></div>
        <div class="quiz-result-panel"><strong>O que mais pode te ajudar agora</strong><span>Cursos, conteúdos, materiais digitais, referências, arquivos por categoria e um acervo amplo para aprender e executar.</span></div>
        <p>{nome}, veja a explicação da página para entender como o Cofre Império Digital reúne cursos, conteúdos e materiais de várias áreas para quem quer aprender, executar e ter mais possibilidades no digital.</p>
      `
    },
    E: {
      title: "{nome}, seu diagnóstico está pronto",
      button: "Ver meu acesso recomendado",
      html: `
        <p>Pelas suas respostas, seu perfil mostra que você já entende que no digital não basta ter vontade. É preciso executar, testar e ter volume.</p>
        <p>Você talvez já tenha começado, já tenha vendido, já tenha postado ou já tenha uma noção melhor do jogo.</p>
        <p>Mas agora o seu desafio é outro: ter mais materiais, mais criativos, mais ideias, mais referências e mais velocidade para testar.</p>
        <p>Quem depende de criar tudo do zero demora mais para executar. E no digital, velocidade de teste faz diferença.</p>
        <p>O seu perfil combina com uma biblioteca organizada que sirva como base para criar, adaptar, testar e alimentar vários projetos ao mesmo tempo.</p>
        <div class="quiz-result-panel"><strong>Seu principal bloqueio</strong><span>Falta de volume, organização e material para executar com velocidade.</span></div>
        <div class="quiz-result-panel"><strong>O que mais pode te ajudar agora</strong><span>Criativos, ganchos, vídeos, referências, materiais por nicho, cursos, conteúdos e arquivos organizados para acelerar produção e testes.</span></div>
        <p>{nome}, veja a explicação da página para entender como o Cofre Império Digital pode te ajudar a ter mais volume de material para produzir, adaptar, testar e executar com mais velocidade.</p>
      `
    }
  };

  const tiePriority = ["E", "C", "B", "D", "A"];

  const personalize = (text) => text.replaceAll("{nome}", quizName);

  const updateProgress = () => {
    if (!progressFill) return;
    const percent = currentStep < 0 ? 0 : Math.min(((currentStep + 1) / steps.length) * 100, 100);
    progressFill.style.width = `${percent}%`;
    if (progressLabel) {
      const activeStep = steps[currentStep];
      progressLabel.textContent = currentStep < 0 ? "Diagnóstico profissional" : activeStep?.querySelector("small")?.textContent || "";
    }
  };

  const hideUtilityScreens = () => {
    if (startScreen) startScreen.classList.remove("is-active");
    if (loading) loading.classList.remove("is-active");
    if (result) result.classList.remove("is-active");
  };

  const updateQuestionNames = () => {
    quiz.querySelectorAll("[data-question-template]").forEach((question) => {
      question.textContent = personalize(question.dataset.questionTemplate || question.textContent);
    });
  };

  const showStep = (index) => {
    hideUtilityScreens();
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === index);
    });
    currentStep = index;
    updateQuestionNames();
    updateProgress();
  };

  const getWinningProfile = () => {
    const topScore = Math.max(...Object.values(scores));
    return tiePriority.find((profile) => scores[profile] === topScore) || "A";
  };

  const showResult = () => {
    const winningProfile = getWinningProfile();
    const content = resultMap[winningProfile];

    steps.forEach((step) => step.classList.remove("is-active"));
    hideUtilityScreens();
    currentStep = steps.length;
    updateProgress();

    if (progressLabel) progressLabel.textContent = "Diagnóstico concluído";
    if (resultTitle) resultTitle.textContent = personalize(content.title);
    if (resultMessage) resultMessage.innerHTML = personalize(content.html);
    if (resultLink) resultLink.textContent = content.button;
    if (result) result.classList.add("is-active");
  };

  const showLoadingThenResult = () => {
    steps.forEach((step) => step.classList.remove("is-active"));
    hideUtilityScreens();
    currentStep = steps.length;
    updateProgress();
    if (progressLabel) progressLabel.textContent = "Analisando suas respostas...";
    if (loading) loading.classList.add("is-active");
    window.setTimeout(showResult, 1300);
  };

  const registerAnswer = (button) => {
    if (!button || !button.matches("[data-profile]")) return;
    if (!button.closest("[data-quiz-step].is-active")) return;

    const profile = button.dataset.profile;
    if (profile && Object.prototype.hasOwnProperty.call(scores, profile)) {
      scores[profile] += 1;
    }

    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      showStep(nextStep);
    } else {
      showLoadingThenResult();
    }
  };

  if (startButton) {
    startButton.addEventListener("click", () => showStep(0));
  }

  if (nameInput && nameNext) {
    nameInput.addEventListener("input", () => {
      nameNext.disabled = nameInput.value.trim().length < 2;
    });

    nameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !nameNext.disabled) {
        event.preventDefault();
        nameNext.click();
      }
    });

    nameNext.addEventListener("click", () => {
      const value = nameInput.value.trim();
      if (value.length < 2) return;
      quizName = value.split(/\s+/)[0];
      showStep(1);
    });
  }

  quiz.addEventListener("click", (event) => {
    registerAnswer(event.target.closest("[data-profile]"));
  });

  if (startScreen && document.body.classList.contains("quiz-locked")) {
    steps.forEach((step) => step.classList.remove("is-active"));
    startScreen.classList.add("is-active");
    currentStep = -1;
    updateProgress();
  }

  if (resultLink) {
    resultLink.addEventListener("click", (event) => {
      event.preventDefault();
      try {
        window.localStorage.setItem(QUIZ_COMPLETED_KEY, "true");
      } catch (error) {
        // Se o navegador bloquear localStorage, libera a página apenas nesta sessão.
      }
      unlockLandingPage();
      const target = document.querySelector(resultLink.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  updateProgress();
}

const includedProducts = [
  {
    name: "Pack de Vídeos — Homens de Poder",
    description: "Vídeos de autoridade e impacto.",
    value: "R$27,00",
    image: "/images/produtos/homens-de-poder.png",
    checkoutUrl: "https://pay.hotmart.com/P106303341V"
  },
  {
    name: "Vídeos Atualizados — Autoridade e Comunicação",
    description: "Conteúdos para comunicação forte.",
    value: "R$37,00",
    image: "/images/produtos/autoridade-comunicacao.png"
  },
  {
    name: "Memes e Conteúdos Virais",
    description: "Conteúdos rápidos para engajar.",
    value: "R$17,00",
    image: "/images/produtos/memes-conteudos-virais.png",
    checkoutUrl: "https://pay.hotmart.com/W106303614N"
  },
  {
    name: "Pack PLRs em Vídeo",
    description: "Base para ofertas digitais.",
    value: "R$47,00",
    image: "/images/produtos/plrs-em-video.png",
    checkoutUrl: "https://pay.hotmart.com/I106303677E"
  },
  {
    name: "Pack de Vídeos Lifestyle",
    description: "Vídeos com estética premium.",
    value: "R$37,00",
    image: "/images/produtos/videos-lifestyle.png",
    checkoutUrl: "https://pay.hotmart.com/B106303717W"
  },
  {
    name: "Curso de Finanças Sérias — Receita Previsível",
    description: "Organização e visão financeira.",
    value: "R$47,00",
    image: "/images/produtos/financas-receita-previsivel.png"
  },
  {
    name: "Pack Grupos de Vendas — Vários Nichos",
    description: "Grupos para divulgação e prospecção.",
    value: "R$27,00",
    image: "/images/produtos/grupos-de-vendas.png",
    checkoutUrl: "https://pay.hotmart.com/U106302901B"
  },
  {
    name: "Cursos no Digital — Grandes Treinamentos e Materiais de Mercado",
    description: "Cursos e conteúdos de mercado.",
    value: "R$87,00",
    image: "/images/produtos/cursos-no-digital.png",
    checkoutUrl: "https://pay.hotmart.com/B106302583R"
  }
];

const productsGrid = document.querySelector("[data-products-grid]");

if (productsGrid) {
  productsGrid.innerHTML = includedProducts
    .map(
      (product) => `
        <article class="product-module-card reveal">
          <a class="product-module-media" href="#oferta" aria-label="Ver ${product.name} no Cofre">
            <img src="${product.image}" alt="${product.name}" width="560" height="560" loading="lazy" decoding="async" />
          </a>
          <div class="product-module-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="product-module-value">Valor estimado: <strong>${product.value}</strong></span>
            ${
              product.checkoutUrl
                ? `<a class="product-module-link" href="${product.checkoutUrl}" target="_blank" rel="noopener noreferrer">Comprar separadamente</a>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});

const cursorFollower = document.querySelector(".cursor-follower");
const canUseCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursorFollower && canUseCustomCursor) {
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let followerX = pointerX;
  let followerY = pointerY;

  const moveFollower = () => {
    followerX += (pointerX - followerX) * 0.18;
    followerY += (pointerY - followerY) * 0.18;
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
    requestAnimationFrame(moveFollower);
  };

  window.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorFollower.classList.add("is-visible");
  });

  document.querySelectorAll("a, button, summary, details").forEach((element) => {
    element.addEventListener("mouseenter", () => cursorFollower.classList.add("is-hovering"));
    element.addEventListener("mouseleave", () => cursorFollower.classList.remove("is-hovering"));
  });

  document.addEventListener("mouseleave", () => cursorFollower.classList.remove("is-visible"));
  document.addEventListener("mouseenter", () => cursorFollower.classList.add("is-visible"));

  moveFollower();
}

const activityMessages = [
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

const topbarMessages = [
  "Oferta sendo acessada agora",
  "Visitantes visualizando esta página",
  "Movimento recente nesta oferta",
  "Pessoas analisando os detalhes"
];

const activityIcons = ["◉", "⚡", "◌", "⌁"];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const activityRegion = document.querySelector(".activity-toast-region");
const topbarText = document.querySelector("[data-activity-topbar-text]");

if (topbarText) {
  let topbarIndex = 0;
  setInterval(() => {
    topbarIndex = (topbarIndex + 1) % topbarMessages.length;
    topbarText.textContent = topbarMessages[topbarIndex];
  }, 7000);
}

if (activityRegion) {
  let lastMessageIndex = -1;

  const pickMessage = () => {
    let nextIndex = randomBetween(0, activityMessages.length - 1);

    if (activityMessages.length > 1) {
      while (nextIndex === lastMessageIndex) {
        nextIndex = randomBetween(0, activityMessages.length - 1);
      }
    }

    lastMessageIndex = nextIndex;
    return activityMessages[nextIndex];
  };

  const showActivityToast = () => {
    const toast = document.createElement("div");
    const visibleFor = randomBetween(4000, 6000);
    const icon = activityIcons[randomBetween(0, activityIcons.length - 1)];

    toast.className = "activity-toast";
    toast.innerHTML = `
      <span class="activity-toast-icon" aria-hidden="true">${icon}</span>
      <span>
        <strong>${pickMessage()}</strong>
        <small>Atividade recente da página</small>
      </span>
    `;

    activityRegion.replaceChildren(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 320);
    }, visibleFor);

    window.setTimeout(showActivityToast, visibleFor + randomBetween(6000, 8000));
  };

  window.setTimeout(showActivityToast, randomBetween(2500, 4500));
}
