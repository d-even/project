export function captureScroll(callback: (velocity: number) => void) {
  let lastScrollY = window.scrollY;
  let lastTime = Date.now();

  window.addEventListener("scroll", () => {
    const now = Date.now();
    const dy = window.scrollY - lastScrollY;
    const dt = now - lastTime;

    if (dt > 0) {
      const velocity = Math.abs(dy) / dt;
      callback(velocity);
    }

    lastScrollY = window.scrollY;
    lastTime = now;
  });
}
