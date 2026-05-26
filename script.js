const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const cursorGlow = document.querySelector(".cursor-glow");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const opened = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      const finalNumber = Number(target.dataset.count);
      const duration = 1200;
      const start = performance.now();

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        target.textContent = Math.round(finalNumber * eased);
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      countObserver.unobserve(target);
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll("[data-count]").forEach((element) => {
  countObserver.observe(element);
});

document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const content = button.nextElementSibling;

    document.querySelectorAll(".accordion-button").forEach((otherButton) => {
      if (otherButton === button) return;
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.nextElementSibling.style.maxHeight = 0;
    });

    button.setAttribute("aria-expanded", String(!expanded));
    content.style.maxHeight = expanded ? 0 : `${content.scrollHeight}px`;
  });
});

const magneticElements = document.querySelectorAll(".magnetic");

magneticElements.forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener("pointerleave", () => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = "0";
});

const canvas = document.querySelector("#auroraCanvas");
const ctx = canvas.getContext("2d");
let width;
let height;
let particles = [];
let animationFrame;

function setupCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.width = Math.floor(window.innerWidth * dpr);
  height = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = window.innerWidth < 760 ? 34 : 62;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2.6 + 0.8,
    speedX: (Math.random() - 0.5) * 0.28,
    speedY: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.38 + 0.1
  }));
}

function drawAurora() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const gradientOne = ctx.createRadialGradient(
    window.innerWidth * 0.22,
    window.innerHeight * 0.18,
    0,
    window.innerWidth * 0.22,
    window.innerHeight * 0.18,
    window.innerWidth * 0.64
  );
  gradientOne.addColorStop(0, "rgba(255,157,187,0.11)");
  gradientOne.addColorStop(1, "rgba(255,157,187,0)");

  const gradientTwo = ctx.createRadialGradient(
    window.innerWidth * 0.82,
    window.innerHeight * 0.36,
    0,
    window.innerWidth * 0.82,
    window.innerHeight * 0.36,
    window.innerWidth * 0.58
  );
  gradientTwo.addColorStop(0, "rgba(201,167,255,0.105)");
  gradientTwo.addColorStop(1, "rgba(201,167,255,0)");

  ctx.fillStyle = gradientOne;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = gradientTwo;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = window.innerHeight + 10;
    if (particle.y > window.innerHeight + 10) particle.y = -10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,248,239,${particle.alpha})`;
    ctx.fill();
  });

  animationFrame = requestAnimationFrame(drawAurora);
}

setupCanvas();
drawAurora();

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  setupCanvas();
  drawAurora();
});
/* Quiz rápido: perguntas, progresso, resultado e WhatsApp personalizado */
(() => {
  const quizQuestions = [
    {
      label: "Motivo principal",
      question: "O que mais te fez pensar em iniciar terapia agora?",
      options: [
        "Quero entender melhor minhas emoções",
        "Tenho me sentido sobrecarregada(o)",
        "Quero cuidar dos meus relacionamentos",
        "Busco autoconhecimento e amadurecimento"
      ]
    },
    {
      label: "Momento atual",
      question: "Qual frase combina mais com o seu momento?",
      options: [
        "Estou pronta(o) para começar",
        "Tenho vontade, mas ainda tenho dúvidas",
        "Quero conversar antes de decidir",
        "Preciso organizar melhor minha rotina"
      ]
    },
    {
      label: "Formato",
      question: "Qual formato parece melhor para você?",
      options: [
        "Atendimento presencial",
        "Atendimento online",
        "Tanto faz, quero ver disponibilidade",
        "Ainda não sei qual formato escolher"
      ]
    },
    {
      label: "Horário",
      question: "Qual período costuma funcionar melhor?",
      options: [
        "Manhã",
        "Tarde",
        "Noite",
        "Tenho flexibilidade"
      ]
    },
    {
      label: "Primeiro contato",
      question: "Como você gostaria que fosse esse primeiro contato?",
      options: [
        "Quero tirar dúvidas com calma",
        "Quero verificar valores e horários",
        "Quero saber como funciona a primeira sessão",
        "Quero agendar assim que possível"
      ]
    }
  ];

  const quizPrefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const quizCard = document.querySelector(".quiz-card");
  const quizQuestion = document.querySelector("[data-quiz-question]");
  const quizQuestionTitle = quizQuestion?.querySelector("h3");
  const quizOverline = quizQuestion?.querySelector(".quiz-overline");
  const quizOptions = document.querySelector("[data-quiz-options]");
  const quizBack = document.querySelector("[data-quiz-back]");
  const quizNext = document.querySelector("[data-quiz-next]");
  const quizStepLabel = document.querySelector("[data-quiz-step-label]");
  const quizBar = document.querySelector("[data-quiz-bar]");
  const quizResult = document.querySelector("[data-quiz-result]");
  const quizSummary = document.querySelector("[data-quiz-summary]");
  const quizWhatsapp = document.querySelector("[data-quiz-whatsapp]");
  const quizRestart = document.querySelector("[data-quiz-restart]");
  const quizActions = document.querySelector("[data-quiz-actions]");

  let quizStep = 0;
  const quizAnswers = [];

  function renderQuizStep() {
    if (!quizCard || !quizQuestion || !quizOptions || !quizQuestionTitle || !quizOverline) return;

    const current = quizQuestions[quizStep];

    quizQuestion.hidden = false;

    if (quizResult) quizResult.hidden = true;
    if (quizActions) quizActions.hidden = false;
    if (quizBack) quizBack.hidden = false;
    if (quizNext) quizNext.hidden = false;

    quizQuestionTitle.textContent = current.question;
    quizOverline.textContent = current.label;
    quizOptions.innerHTML = "";

    current.options.forEach((option) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.setAttribute("aria-pressed", quizAnswers[quizStep] === option ? "true" : "false");

      if (quizAnswers[quizStep] === option) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        quizAnswers[quizStep] = option;

        quizOptions.querySelectorAll(".quiz-option").forEach((other) => {
          other.classList.remove("is-selected");
          other.setAttribute("aria-pressed", "false");
        });

        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");

        if (quizNext) {
          quizNext.disabled = false;
        }
      });

      quizOptions.appendChild(button);
    });

    if (quizStepLabel) {
      quizStepLabel.textContent = `Etapa ${quizStep + 1} de ${quizQuestions.length}`;
    }

    if (quizBar) {
      quizBar.style.width = `${((quizStep + 1) / quizQuestions.length) * 100}%`;
    }

    if (quizBack) {
      quizBack.disabled = quizStep === 0;
    }

    if (quizNext) {
      quizNext.textContent = quizStep === quizQuestions.length - 1 ? "Ver resultado" : "Continuar";
      quizNext.disabled = !quizAnswers[quizStep];
    }
  }

  function showQuizResult() {
    if (!quizQuestion || !quizResult || !quizSummary || !quizWhatsapp || !quizStepLabel || !quizBar) return;

    quizQuestion.hidden = true;
    quizResult.hidden = false;

    if (quizActions) {
      quizActions.hidden = true;
    }

    quizStepLabel.textContent = "Quiz concluído";
    quizBar.style.width = "100%";

    quizSummary.innerHTML = quizQuestions
      .map((item, index) => `<p><strong>${item.label}:</strong> ${quizAnswers[index]}</p>`)
      .join("");

    const messageLines = [
      "Olá, Thais! Vim pelo seu site e respondi ao quiz rápido.",
      "Gostaria de saber mais sobre o atendimento.",
      "",
      ...quizQuestions.map((item, index) => `${item.label}: ${quizAnswers[index]}`)
    ];

    quizWhatsapp.href = `https://wa.me/5518991692290?text=${encodeURIComponent(messageLines.join("\n"))}`;
  }

  if (quizCard && quizNext && quizBack) {
    renderQuizStep();

    quizNext.addEventListener("click", () => {
      if (!quizAnswers[quizStep]) return;

      if (quizStep < quizQuestions.length - 1) {
        quizStep += 1;
        renderQuizStep();

        quizCard.scrollIntoView({
          behavior: quizPrefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });

        return;
      }

      showQuizResult();

      quizCard.scrollIntoView({
        behavior: quizPrefersReducedMotion ? "auto" : "smooth",
        block: "center"
      });
    });

    quizBack.addEventListener("click", () => {
      if (quizStep === 0) return;

      quizStep -= 1;
      renderQuizStep();
    });
  }

  if (quizRestart) {
    quizRestart.addEventListener("click", () => {
      quizStep = 0;
      quizAnswers.length = 0;
      renderQuizStep();
    });
  }
})();