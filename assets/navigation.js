document.querySelectorAll("[data-back-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const fallback = link.dataset.fallback || link.getAttribute("href");
    const referrer = document.referrer ? new URL(document.referrer) : null;

    if (referrer && referrer.origin === window.location.origin && referrer.href !== window.location.href) {
      history.back();
      return;
    }

    window.location.href = new URL(fallback, document.baseURI).href;
  });
});
