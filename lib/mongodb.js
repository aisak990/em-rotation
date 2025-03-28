import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Set this in Vercel Environment Variables
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
