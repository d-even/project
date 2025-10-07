import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const client = await clientPromise;
  const db = client.db("fraud_detection");
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  await users.insertOne({ email, passwordHash, createdAt: new Date() });
  return res.json({ ok: true });
}


