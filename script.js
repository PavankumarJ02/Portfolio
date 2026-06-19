const nav = document.querySelector(".nav");
const reveals = document.querySelectorAll(".reveal");
const year = document.getElementById("year");
const themeToggle = document.getElementById("theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const storageKey = "portfolio-theme";
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const applyTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  }

  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "dark" ? "#111313" : "#f5f1e8");
  }
};

const getPreferredTheme = () => {
  const savedTheme = window.localStorage.getItem(storageKey);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return themeMedia.matches ? "dark" : "light";
};

const syncNavState = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 16);
};

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

themeMedia.addEventListener("change", (event) => {
  if (window.localStorage.getItem(storageKey)) return;
  applyTheme(event.matches ? "dark" : "light");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

if (year) {
  year.textContent = new Date().getFullYear();
}

syncNavState();

window.addEventListener("scroll", syncNavState, { passive: true });
