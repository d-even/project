import { useEffect, useState } from "react";
import { initFraudDetection } from "@/behavioral";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [risk, setRisk] = useState<number | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      window.location.href = "/testing";
    } else {
      setMsg(data.error || "Error");
    }
  }

  useEffect(() => {
    function onRisk(e: any) {
      const r = e?.detail?.riskScore ?? null;
      if (r != null) {
        setRisk(r);
        setMsg(`Risk ${r.toFixed(2)} detected. OTP required. Check your email.`);
        setOtpSent(true);
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("behavior-risk", onRisk as EventListener);
      return () => window.removeEventListener("behavior-risk", onRisk as EventListener);
    }
  }, []);

  async function sendOtp() {
    const res = await fetch("/api/otp/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      if (data.previewUrl) {
        setMsg(`OTP sent. Preview URL: ${data.previewUrl}`);
      } else {
        setMsg("OTP sent to email");
      }
    } else {
      setMsg("Failed to send OTP");
    }
  }

  async function verifyOtp() {
    const res = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code: otp }) });
    const data = await res.json();
    if (data.ok) { setMsg("OTP verified. Access granted."); } else { setMsg("OTP invalid or expired"); }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Sign in</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />
        <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />
        <button type="submit">Sign in</button>
      </form>

      <div style={{ marginTop: 16 }}>
        <p>{msg}</p>
        <button onClick={sendOtp} style={{ marginRight: 8 }}>Send OTP</button>
        {otpSent && (
          <span>
            <input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ marginRight: 8 }} />
            <button onClick={verifyOtp}>Verify OTP</button>
          </span>
        )}
      </div>
    </div>
  );
}


