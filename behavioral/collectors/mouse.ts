export function captureMouse(callback: (velocity: number) => void) {
  let lastX = 0, lastY = 0, lastTime = Date.now();

  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dt = now - lastTime;

    if (dt > 0) {
      const velocity = Math.sqrt(dx*dx + dy*dy) / dt;
      callback(velocity);
    }

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
  });
}
