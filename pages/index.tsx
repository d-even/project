// import { useEffect } from "react";
// import { initFraudDetection } from "@/behavioral";

// export default function Home() {
//   useEffect(() => {
//     initFraudDetection({ userId: "user123", threshold: 0.7 });
//   }, []);

//   return (
//     <div>
//       <h1>Welcome Back 👋</h1>
//       <p>We'll monitor your behavior for 1 min for fraud detection.</p>
//     </div>
//   );
// }
type PredictResponse = { risk_score: number };

async function sendBehaviorData(data: unknown) {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: PredictResponse = await response.json();
  console.log("Predicted Risk Score:", result.risk_score);

  if (result.risk_score > 0.8) {
    alert("⚠️ High risk detected! Triggering OTP verification.");
  } else {
    alert("✅ Normal behavior detected.");
  }
}

export default function Home() {
  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Behavioral Auth Demo</h1>
      <p>Use the links below to sign up or sign in.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/signup">Sign up</a>
        <a href="/signin">Sign in</a>
      </div>
    </div>
  );
}