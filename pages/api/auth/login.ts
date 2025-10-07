import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const client = await clientPromise;
  const db = client.db("fraud_detection");
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user._id.toString(), email }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
}


