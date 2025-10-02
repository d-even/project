import clientPromise from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, features } = req.body;
  const client = await clientPromise;
  const db = client.db("fraud_detection");
  const profiles = db.collection("user_profiles");

  const existing = await profiles.findOne({ userId });

  if (!existing) {
    await profiles.insertOne({ userId, features });
    return res.json({ isNewUser: true });
  }

  // Simple Euclidean distance risk calculation
  let diff = 0;
  for (const key of Object.keys(features)) {
    diff += Math.pow(features[key] - existing.features[key], 2);
  }
  const riskScore = Math.min(Math.sqrt(diff) / 100, 1);

  res.json({ isNewUser: false, riskScore });
}
