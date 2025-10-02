import { useEffect } from "react";
import { initFraudDetection } from "@/behavioral";

export default function Home() {
  useEffect(() => {
    initFraudDetection({ userId: "user123", threshold: 0.7 });
  }, []);

  return (
    <div>
      <h1>Welcome Back 👋</h1>
      <p>We'll monitor your behavior for 1 min for fraud detection.</p>
    </div>
  );
}
