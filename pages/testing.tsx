import { useEffect, useState } from "react";
import { initFraudDetection } from "@/behavioral";

export default function Testing() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Move mouse, type and scroll for 20 seconds...");

  useEffect(() => {
    // In a real app, email would come from JWT/session; for demo ask once.
    const e = window.localStorage.getItem("demo-email") || "";
    setEmail(e);
  }, []);

  useEffect(() => {
    if (!email) return;

    function onResult(e: any) {
      const { riskScore, isNewUser, overThreshold } = e.detail || {};
      if (isNewUser) {
        alert("Baseline saved. Welcome!");
        setStatus("Baseline stored. Future logins will be checked.");
      } else if (overThreshold) {
        alert("Different user detected (high risk). OTP sent to your email.");
        // Proactively attempt to send OTP and show preview URL if using Ethereal
        fetch("/api/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }).then(r => r.json()).then(d => {
          if (d?.previewUrl) {
            setStatus(`High risk (${(riskScore ?? 0).toFixed(2)}). OTP preview: ${d.previewUrl}`);
          } else {
            setStatus(`High risk (${(riskScore ?? 0).toFixed(2)}). Check email for OTP.`);
          }
        }).catch(() => {
          setStatus(`High risk (${(riskScore ?? 0).toFixed(2)}). Check email for OTP.`);
        });
      } else {
        alert("Same user detected (low risk).");
        setStatus(`Low risk (${(riskScore ?? 0).toFixed(2)}). You're good.`);
      }
    }

    window.addEventListener("behavior-result", onResult as EventListener);
    initFraudDetection({ userId: email, threshold: 0.7 });
    return () => window.removeEventListener("behavior-result", onResult as EventListener);
  }, [email]);

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Testing</h2>
      {!email && (
        <div style={{ marginBottom: 12 }}>
          <p>Enter your email for this demo:</p>
          <input onChange={e => { setEmail(e.target.value); window.localStorage.setItem("demo-email", e.target.value); }} placeholder="email" />
        </div>
      )}
      <p>{status}</p>
      <p>Interact with the page for 20 seconds: type, move, and scroll.</p>
      <textarea placeholder="Type here..." style={{ width: "100%", height: 120 }} />
      <div style={{ height: 800 }} />
    </div>
  );
}


