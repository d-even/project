export function captureKeystrokes(callback: (interval: number) => void) {
  let lastKeyTime = Date.now();

  window.addEventListener("keydown", () => {
    const now = Date.now();
    const diff = now - lastKeyTime;
    callback(diff);
    lastKeyTime = now;
  });
}
