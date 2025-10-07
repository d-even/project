import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import nodemailer from "nodemailer";

const MAIL_HOST = process.env.MAIL_HOST || "smtp.ethereal.email";
const MAIL_PORT = Number(process.env.MAIL_PORT || 587);
const MAIL_USER = process.env.MAIL_USER || "";
const MAIL_PASS = process.env.MAIL_PASS || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email required" });

  const client = await clientPromise;
  const db = client.db("fraud_detection");
  const otps = db.collection("otps");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await otps.updateOne({ email }, { $set: { email, code, expiresAt, used: false } }, { upsert: true });

  let transporter: nodemailer.Transporter;
  try {
    if (MAIL_USER && MAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: MAIL_PORT === 465,
        auth: { user: MAIL_USER, pass: MAIL_PASS }
      });
    } else {
      // Fallback to Ethereal test account for local/dev
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
    }

    const info = await transporter.sendMail({
      from: "noreply@example.com",
      to: email,
      subject: "Your verification code",
      text: `Your OTP is ${code}`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    return res.json({ ok: true, messageId: info.messageId, previewUrl });
  } catch (err: any) {
    console.error("SMTP send error", err?.message || err);
    return res.status(500).json({ ok: false, error: "email_send_failed", details: err?.message || "unknown" });
  }
}


