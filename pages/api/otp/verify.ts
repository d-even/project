import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: "email and code required" });

  const client = await clientPromise;
  const db = client.db("fraud_detection");
  const otps = db.collection("otps");

  const rec = await otps.findOne({ email });
  if (!rec || rec.used) return res.status(400).json({ ok: false, error: "invalid" });
  if (rec.code !== code) return res.status(400).json({ ok: false, error: "invalid" });
  if (new Date(rec.expiresAt).getTime() < Date.now()) return res.status(400).json({ ok: false, error: "expired" });

  await otps.updateOne({ email }, { $set: { used: true } });
  return res.json({ ok: true });
}


