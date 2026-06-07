// EDITE AQUI: troque estes placeholders pelos links finais da sua operação.
const CONFIG = {
  checkoutUrl: "https://pay.hotmart.com/R106118031H?checkoutMode=10",
  whatsappUrl: "https://wa.me/message/32R7UJIK7H4HB1",
  supportUrl: "https://wa.me/message/32R7UJIK7H4HB1",
};

document.querySelectorAll("[data-checkout-link]").forEach((link) => {
  link.href = CONFIG.checkoutUrl;
  link.addEventListener("click", () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        content_name: "Cofre Império Digital",
        value: 47.9,
        currency: "BRL"
      });
    }
  });
});

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.href = CONFIG.whatsappUrl;
});

document.querySelectorAll("[data-support-link]").forEach((link) => {
  link.href = CONFIG.supportUrl;
});

document.querySelectorAll("[data-vsl-player]").forEach((player) => {
  const video = player.querySelector("video");
  const source = player.querySelector("source[data-src]");
  const playButton = player.querySelector("[data-vsl-play]");
  const progressFill = player.querySelector("[data-vsl-progress]");
  const progressWrap = player.querySelector(".vsl-progress");
  const section = player.closest(".vsl-section");
  const vslCta = section ? section.querySelector(".vsl-cta") : null;

  if (!video || !source || !playButton) return;

  let maxWatchedTime = 0;
  let isRestoringTime = false;
  let hasShownCta = false;

  video.controls = false;
  video.disablePictureInPicture = true;
  video.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback");

  const getCtaRevealTime = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;

    if (duration <= 0) return null;

    return duration > 90 ? duration - 90 : duration * 0.7;
  };

  const showVslCta = () => {
    if (!vslCta || hasShownCta) return;

    hasShownCta = true;
    vslCta.hidden = false;
    requestAnimationFrame(() => vslCta.classList.add("is-visible"));
  };

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

  const unlockPage = () => {
    document.body.classList.remove("vsl-locked");
    document.body.classList.add("vsl-unlocked");
    player.classList.remove("is-playing");
    player.classList.add("is-complete");

    if (progressFill) {
      progressFill.style.width = "100%";
    }

    if (progressWrap) {
      progressWrap.setAttribute("aria-valuenow", "100");
    }

    showVslCta();
  };

  const loadVideo = () => {
    if (!source.src) {
      source.src = source.dataset.src;
      video.load();
    }

    player.classList.add("is-loaded");
    video.controls = false;
    video.play().catch(() => {
      player.classList.remove("is-loaded", "is-playing");
      playButton.disabled = false;
    });
  };

  playButton.addEventListener("click", () => {
    playButton.disabled = true;
    loadVideo();
  });

  video.addEventListener("play", () => {
    player.classList.add("is-playing");
    video.controls = false;
  });

  video.addEventListener("contextmenu", (event) => event.preventDefault());

  video.addEventListener("loadedmetadata", () => {
    updateProgress();
  });

  video.addEventListener("timeupdate", () => {
    if (!isRestoringTime && video.currentTime > maxWatchedTime) {
      maxWatchedTime = video.currentTime;
    }

    updateProgress();

    const revealAt = getCtaRevealTime();
    if (revealAt !== null && video.currentTime >= revealAt) {
      showVslCta();
    }
  });

  video.addEventListener("seeking", () => {
    if (isRestoringTime || video.ended) return;

    if (Math.abs(video.currentTime - maxWatchedTime) > 0.65) {
      isRestoringTime = true;
      video.currentTime = maxWatchedTime;
      isRestoringTime = false;
    }
  });

  video.addEventListener("ratechange", () => {
    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
    }
  });

  video.addEventListener("ended", unlockPage);

  if (vslCta) {
    vslCta.addEventListener("click", (event) => {
      event.preventDefault();

      document.body.classList.remove("vsl-locked");
      document.body.classList.add("vsl-unlocked");

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
