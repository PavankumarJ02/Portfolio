const nav = document.querySelector(".nav");
const reveals = document.querySelectorAll(".reveal");
const year = document.getElementById("year");

const syncNavState = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 16);
};

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
year.textContent = new Date().getFullYear();
syncNavState();

window.addEventListener("scroll", syncNavState, { passive: true });
