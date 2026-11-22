/* ==========================================================
   Punith V A: Portfolio scripts
   ========================================================== */

/* ---------- CONFIG: edit these values ---------- */
const CONFIG = {
  // Google Sheets / Apps Script endpoint for the contact form.
  googleSheetsUrl: "https://script.google.com/macros/s/AKfycbzWQ8fFzDbQZCkWt5zs7_fMwuIQ_qUMn0lvWRC-O2TZvrQR7T1lsh0J4nTx4O9Z8aEl/exec",

  // Words cycled by the typing effect in the hero
  typingWords: ["MERN Stack Developer", "DevOps Engineer", "Python Developer", "Full Stack Developer"],
};

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initActiveLinks();
  initTyping();
  initTabs();
  initReveal();
  initPlaceholderLinks();
  initBackToTop();
  initContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Theme toggle (dark default, saved in localStorage) ---------- */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const icon = btn.querySelector("i");

  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
  apply(saved === "light" ? "light" : "dark");

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  function apply(theme) {
    root.dataset.theme = theme;
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0b1020" : "#f5f7ff";
  }
}

/* ---------- Mobile navigation + sticky header ---------- */
function initNav() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const icon = toggle.querySelector("i");

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 860) setOpen(false); });

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Highlight the nav link of the section in view ---------- */
function initActiveLinks() {
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);

  const setActive = (id) => links.forEach((l) => {
    const on = l.getAttribute("href") === "#" + id;
    l.classList.toggle("active", on);
    if (on) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current");
  });

  const update = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0].id;
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    // Bottom of page: force the last section active
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1].id;
    setActive(current);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* ---------- Typing effect ---------- */
function initTyping() {
  const el = document.getElementById("typed-text");
  const words = CONFIG.typingWords;
  if (!el || !words.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = words[0];
    return;
  }

  let w = 0, c = 0, deleting = false;
  const tick = () => {
    const word = words[w];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);

    let delay = deleting ? 45 : 85;
    if (!deleting && c === word.length) { deleting = true; delay = 1500; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
    setTimeout(tick, delay);
  };
  el.textContent = "";
  tick();
}

/* ---------- About tabs (click + arrow-key support) ---------- */
function initTabs() {
  const root = document.querySelector("[data-tabs]");
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];

  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.toggle("active", on);
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length], true);
      if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length], true);
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((i) => i.classList.add("visible")); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 80 + "ms"; // light stagger within a row
    io.observe(el);
  });
}

/* ---------- Project links with no URL yet ---------- */
function initPlaceholderLinks() {
  document.querySelectorAll('a[data-placeholder]').forEach((a) => {
    a.classList.add("is-placeholder");
    a.setAttribute("aria-disabled", "true");
    a.title = "Link coming soon";
    a.addEventListener("click", (e) => e.preventDefault());
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  const toggle = () => btn.classList.toggle("show", window.scrollY > 500);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Contact form: validation + real submission ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const label = submitBtn.querySelector(".btn-label");

  const rules = {
    name: (v) => (v.length < 2 ? "Enter your full name (at least 2 characters)." : ""),
    email: (v) => (!v ? "Enter your email address." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email, like name@example.com." : ""),
    subject: (v) => (v.length < 3 ? "Enter a subject (at least 3 characters)." : ""),
    message: (v) => (v.length < 10 ? "Write a message of at least 10 characters." : ""),
  };

  const validateField = (name) => {
    const input = form.elements[name];
    const msg = rules[name](input.value.trim());
    input.closest(".field").classList.toggle("invalid", Boolean(msg));
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    document.getElementById(name + "-error").textContent = msg;
    return !msg;
  };

  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener("blur", () => validateField(name));
    input.addEventListener("input", () => { if (input.closest(".field").classList.contains("invalid")) validateField(name); });
  });

  const setStatus = (text, type) => { status.textContent = text; status.className = "form-status " + (type || ""); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      const firstBad = Object.keys(rules).find((n) => form.elements[n].getAttribute("aria-invalid") === "true");
      form.elements[firstBad].focus();
      setStatus("Fix the highlighted fields and try again.", "fail");
      return;
    }

    // Honeypot: bots fill this in
    if (form.elements.botcheck.value) return;

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();

    const useGoogleSheets = Boolean(CONFIG.googleSheetsUrl);

    if (!useGoogleSheets) {
      setStatus("Message not sent: the Google Sheets web app URL is missing.", "fail");
      return;
    }

    submitBtn.disabled = true;
    label.textContent = "Sending...";

    try {
      const response = await fetch(CONFIG.googleSheetsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message
        })
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok || result.success === false) {
        throw new Error(result.message || result.error || "Google Sheets rejected the request.");
      }

      setStatus("Message sent successfully. I will get back to you soon.", "success");
      form.reset();
    } catch (err) {
      const message = err && err.message ? err.message : "Check your connection";
      const friendlyMessage = message === "Failed to fetch"
        ? "Google Apps Script is not published as a public Web App yet. In Apps Script, go to Deploy > New deployment > Web app > Who has access: Anyone."
        : message;

      setStatus("Message not sent. " + friendlyMessage + " Try again, or contact me on LinkedIn.", "fail");
    } finally {
      submitBtn.disabled = false;
      label.textContent = "Send Message";
    }
  });
}
