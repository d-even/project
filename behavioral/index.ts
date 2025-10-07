import { captureKeystrokes } from "./collectors/keyboard";
import { captureMouse } from "./collectors/mouse";
import { captureScroll } from "./collectors/scroll";
import { extractFeatures } from "./utils/featureExtract";

export function initFraudDetection({ userId, threshold = 0.7 }: { userId: string; threshold?: number }) {
  const keystrokes: number[] = [];
  const mouseVelocities: number[] = [];
  const scrollVelocities: number[] = [];

  if (typeof window !== "undefined") {
    captureKeystrokes((d) => keystrokes.push(d));
    captureMouse((v) => mouseVelocities.push(v));
    captureScroll((v) => scrollVelocities.push(v));

    setTimeout(async () => {
      const features = extractFeatures(keystrokes, mouseVelocities, scrollVelocities);
      const res = await fetch("/api/compare-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, features })
      });

      const { riskScore, isNewUser } = await res.json();

      const overThreshold = !isNewUser && riskScore > threshold;
      // Dispatch a general result event for any UI to consume
      const resultEvt = new CustomEvent("behavior-result", {
        detail: { riskScore, isNewUser, overThreshold }
      });
      window.dispatchEvent(resultEvt);

      if (isNewUser) {
        console.log("✅ Profile stored for first time.");
      } else {
        console.log("Risk score:", riskScore);
        if (overThreshold) {
          try {
            await fetch("/api/otp/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: userId })
            });
          } catch {}
          const evt = new CustomEvent("behavior-risk", {
            detail: { riskScore, action: "otp-required" }
          });
          window.dispatchEvent(evt);
        }
      }
    }, 20_000);
  }
}
