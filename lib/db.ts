
import { MongoClient } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri);
  globalWithMongo._mongoClientPromise = client.connect();
}

clientPromise = globalWithMongo._mongoClientPromise!;
export default clientPromise;
