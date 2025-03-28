import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const MONGO_URI = "mongodb+srv://aisak:B0cQu1knBTYYF0Zq@cluster0.rjlin0p.mongodb.net/Rotation?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Rotation";

export async function GET() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    // Fetch users sorted by order
    const users = await usersCollection.find({}).sort({ order: 1 }).toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  } finally {
    await client.close();
  }
}
