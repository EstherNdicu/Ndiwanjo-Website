const navbar = document.getElementById("navbar") || document.getElementById("site-header");
const hamburger = document.getElementById("hamburger") || document.querySelector(".menu-toggle");
const navLinks = document.getElementById("nav-links") || document.getElementById("main-nav");
const progressBar = document.querySelector(".progress-bar");
const backToTop = document.getElementById("back-to-top");

function setScrolledState() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;

  if (navbar) navbar.classList.toggle("scrolled", y > 30);
  if (backToTop) backToTop.classList.toggle("show", y > 500);
  if (progressBar) progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
}

window.addEventListener("scroll", setScrolledState, { passive:true });
setScrolledState();

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("show");
    hamburger.classList.toggle("active", open);
    navbar?.classList.toggle("menu-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      hamburger.classList.remove("active");
      navbar?.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior:"smooth", block:"start" });
  });
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top:0, behavior:"smooth" });
});

const revealItems = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold:.16, rootMargin:"0px 0px -40px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function animateCounter(counter) {
  if (counter.dataset.done) return;
  counter.dataset.done = "true";

  const target = Number(counter.dataset.target || 0);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) requestAnimationFrame(update);
    else counter.textContent = target;
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll(".counter");
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold:.55 });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

document.querySelectorAll(".service-acc-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".service-acc-item");
    const panel = item?.querySelector(".service-acc-panel");
    const isOpen = item?.classList.contains("open");
    if (!item || !panel) return;

    document.querySelectorAll(".service-acc-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
      openItem.querySelector(".service-acc-trigger")?.setAttribute("aria-expanded", "false");
      const openPanel = openItem.querySelector(".service-acc-panel");
      if (openPanel) openPanel.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const success = form.querySelector(".form-success");
  const button = form.querySelector("button[type='submit']");
  const original = button?.textContent || "Send Message";

  if (button) {
    button.textContent = "Sending...";
    button.disabled = true;
  }

  window.setTimeout(() => {
    form.reset();
    if (button) {
      button.textContent = original;
      button.disabled = false;
    }
    if (success) {
      success.style.display = "block";
      window.setTimeout(() => { success.style.display = "none"; }, 5000);
    }
  }, 900);
});
