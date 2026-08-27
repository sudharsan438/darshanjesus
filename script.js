const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const communityForm = document.querySelector(".community-form");
const emailInput = document.querySelector("#email");
const formStatus = document.querySelector("#subscribe-status");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

if (communityForm && emailInput && formStatus) {
  const setStatus = (message, isError = false) => {
    formStatus.textContent = message;
    formStatus.classList.toggle("form-status-error", isError);
    formStatus.classList.toggle("form-status-success", !isError);
  };

  communityForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email || !emailInput.checkValidity()) {
      setStatus("Please enter a valid email address.", true);
      emailInput.focus();
      return;
    }

    setStatus("Submitting to MailerLite...");
    communityForm.submit();
  });
}
