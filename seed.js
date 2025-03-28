import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://itzbasatmaqsood:mj6THfVfpSn4CXW6@cluster0.1usflgg.mongodb.net/Client?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Client";

async function initializeOrder() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    for (let i = 0; i < users.length; i++) {
      await usersCollection.updateOne({ id: users[i].id }, { $set: { order: i } });
    }

    console.log("User order initialized successfully.");
  } catch (error) {
    console.error("Error initializing user order:", error);
  } finally {
    await client.close();
  }
}

initializeOrder();
