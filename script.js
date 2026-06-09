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

document.querySelectorAll("[data-vsl-player]").forEach((player) => {
  const video = player.querySelector("video");
  const progressFill = player.querySelector("[data-vsl-progress]");
  const progressWrap = player.querySelector(".vsl-progress");
  const section = player.closest(".vsl-section");
  const vslCta = section ? section.querySelector(".vsl-cta") : null;

  if (!video) return;

  video.controls = true;

  const updateProgress = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const percent = duration > 0 ? Math.min((video.currentTime / duration) * 100, 100) : 0;

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    if (progressWrap) {
      progressWrap.setAttribute("aria-valuenow", String(Math.round(percent)));
    }
  };

  video.addEventListener("play", () => {
    player.classList.add("is-loaded");
    player.classList.add("is-playing");
  });

  video.addEventListener("pause", () => {
    player.classList.remove("is-playing");
  });

  video.addEventListener("loadedmetadata", () => {
    updateProgress();
  });

  video.addEventListener("timeupdate", () => {
    updateProgress();
  });

  if (vslCta) {
    vslCta.addEventListener("click", (event) => {
      event.preventDefault();

      const target = document.querySelector(vslCta.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
});

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
