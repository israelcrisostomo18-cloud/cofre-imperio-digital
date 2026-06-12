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
  const result = quiz.querySelector("[data-quiz-result]");
  const resultTitle = quiz.querySelector("[data-quiz-result-title]");
  const resultMessage = quiz.querySelector("[data-quiz-result-message]");
  const resultLink = quiz.querySelector("[data-quiz-result-link]");
  const progressFill = quiz.querySelector("[data-quiz-progress]");
  const doubtAnswer = quiz.querySelector("[data-quiz-doubt-answer]");
  const doubtTitle = quiz.querySelector("[data-quiz-doubt-title]");
  const doubtCopy = quiz.querySelector("[data-quiz-doubt-copy]");
  const doubtContinue = quiz.querySelector("[data-quiz-doubt-continue]");
  const scores = {
    iniciante: 0,
    tentou: 0,
    conteudo: 0,
    crescimento: 0
  };

  const resultMap = {
    iniciante: {
      title: "Perfil identificado: Iniciante buscando direção",
      message:
        "Pelo que você respondeu, seu maior bloqueio hoje parece ser falta de clareza sobre por onde começar. O Cofre Império Digital pode te ajudar mostrando conteúdos, ideias, criativos e materiais para você não precisar começar do zero."
    },
    tentou: {
      title: "Perfil identificado: Pessoa que já tentou, mas ainda não encontrou o caminho certo",
      message:
        "Pelo que você respondeu, você já tentou ganhar dinheiro na internet, mas talvez tenha faltado estrutura, conteúdo pronto e uma direção mais simples. O Cofre Império Digital pode te ajudar a organizar melhor esse começo."
    },
    conteudo: {
      title: "Perfil identificado: Criador travado por falta de conteúdo",
      message:
        "Pelo que você respondeu, seu maior desafio parece ser ter ideias, criativos e materiais prontos para usar. O Cofre Império Digital reúne conteúdos e estratégias que podem facilitar esse processo."
    },
    crescimento: {
      title: "Perfil identificado: Pessoa buscando crescimento",
      message:
        "Pelo que você respondeu, você não está apenas começando. Você quer melhorar seus resultados e ter mais materiais, ideias e estratégias para testar. O Cofre Império Digital pode ser uma boa opção para expandir suas possibilidades."
    }
  };

  const doubtMap = {
    valor: {
      title: "Quanto custaria comprar tudo separadamente?",
      html: `
        <p>Se você fosse montar tudo sozinho, comprando cada material separado, o custo poderia ficar bem mais alto do que parece.</p>
        <p>Dentro do Cofre Império Digital estão incluídos materiais como vídeos e cortes, memes, PLRs em vídeo, vídeos lifestyle, curso de finanças, grupos de vendas, cursos no digital e bônus práticos de organização de perfil, escolha de nicho, monetização, plano de execução, ideias de produtos e checklist diário.</p>
        <p>Veja uma estimativa mais realista:</p>
        <ul>
          <li>Pack de vídeos de mentalidade e autoridade: média de R$89 a R$189</li>
          <li>Cortes e vídeos atualizados para criação de conteúdo: média de R$120 a R$250</li>
          <li>Biblioteca de memes e conteúdos virais: média de R$39 a R$90</li>
          <li>Pack de PLRs em vídeo: média de R$250 a R$600</li>
          <li>Pack de vídeos lifestyle, luxo, rotina, viagens, carros e motivação: média de R$150 a R$350</li>
          <li>Curso de finanças, organização e receita previsível: média de R$180 a R$500</li>
          <li>Lista de grupos de vendas separados por nichos: média de R$30 a R$100</li>
          <li>Cursos no digital e materiais sobre nicho, conteúdo, oferta e posicionamento: média de R$400 a R$1.200</li>
          <li>Guia prático de bônus com organização de perfil, escolha de nicho, monetização, plano de execução, ideias de produtos e checklist diário: média de R$70 a R$180</li>
        </ul>
        <p>Comprando tudo separadamente, uma estimativa conservadora ficaria entre <strong>R$1.300 e R$3.400</strong>.</p>
        <p>Em versões mais completas, com cursos, packs maiores e materiais premium, esse valor poderia passar de <strong>R$4.000</strong>.</p>
        <p>O Cofre Império Digital reúne tudo isso em um único acesso, para você não precisar procurar material por material.</p>
      `
    },
    vale: {
      title: "Vale a pena comprar o Cofre Império Digital?",
      html: `
        <p>Sim, vale a pena principalmente para quem quer parar de perder tempo procurando conteúdo solto na internet.</p>
        <p>O Cofre Império Digital reúne em um só lugar materiais que podem ajudar quem está começando ou tentando destravar no digital: vídeos, cortes, memes, PLRs em vídeo, conteúdos lifestyle, materiais de finanças, grupos de vendas, cursos no digital e bônus práticos para organizar perfil, escolher nicho, criar rotina de postagem e pensar em formas de monetização.</p>
        <p>Ele não promete resultado garantido, porque isso depende da sua aplicação, consistência, nicho escolhido e oferta. Mas ele entrega uma base de materiais e referências para você começar com mais direção, em vez de tentar montar tudo do zero.</p>
      `
    },
    confianca: {
      title: "Posso confiar na compra do Cofre Império Digital?",
      html: `
        <p>Sim. A compra é feita por uma plataforma segura de pagamento, a Hotmart.</p>
        <p>Isso significa que o pagamento não é feito diretamente para uma pessoa no WhatsApp ou Pix aleatório. A Hotmart processa a compra e disponibiliza os dados da transação para o comprador.</p>
        <p>Além disso, se o produto estiver configurado com garantia de 7 dias, você pode solicitar reembolso dentro do prazo informado na página de pagamento. A própria Hotmart informa que o prazo de garantia pode variar conforme a configuração do produtor, e esse prazo aparece no momento da compra.</p>
        <p>Após solicitar o reembolso, a Hotmart informa que a solicitação pode levar até 7 dias para ser aprovada e liberada ao banco ou à plataforma de pagamento usada na compra.</p>
        <p>Ou seja: você compra por uma plataforma conhecida, com processo de pagamento e reembolso, sem depender de transferência direta para desconhecidos.</p>
      `
    }
  };

  const profileOrder = ["iniciante", "tentou", "conteudo", "crescimento"];
  let currentStep = 0;

  const updateProgress = () => {
    if (!progressFill) return;
    const percent = Math.min((currentStep / steps.length) * 100, 100);
    progressFill.style.width = `${percent}%`;
  };

  const showStep = (index) => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === index);
    });
    currentStep = index;
    updateProgress();
  };

  const getWinningProfile = () =>
    profileOrder.reduce((winner, profile) => (scores[profile] > scores[winner] ? profile : winner), profileOrder[0]);

  const showResult = () => {
    const winningProfile = getWinningProfile();
    const content = resultMap[winningProfile];

    steps.forEach((step) => step.classList.remove("is-active"));
    if (doubtAnswer) doubtAnswer.classList.remove("is-active");
    currentStep = steps.length;
    updateProgress();

    if (resultTitle) resultTitle.textContent = content.title;
    if (resultMessage) resultMessage.textContent = content.message;
    if (resultLink) resultLink.textContent = "Ver meu acesso recomendado";
    if (result) result.classList.add("is-active");
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
      showResult();
    }
  };

  quiz.addEventListener("click", (event) => {
    registerAnswer(event.target.closest("[data-profile]"));

    const doubtButton = event.target.closest("[data-quiz-doubt]");
    if (!doubtButton || !doubtButton.closest("[data-quiz-step].is-active")) return;

    const answer = doubtMap[doubtButton.dataset.quizDoubt];
    if (!answer) return;

    steps.forEach((step) => step.classList.remove("is-active"));
    if (doubtTitle) doubtTitle.textContent = answer.title;
    if (doubtCopy) doubtCopy.innerHTML = answer.html;
    if (doubtAnswer) doubtAnswer.classList.add("is-active");
    currentStep = steps.length;
    updateProgress();
  });

  if (doubtContinue) {
    doubtContinue.addEventListener("click", showResult);
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

  if (document.body.classList.contains("quiz-locked")) {
    showStep(0);
  }
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
