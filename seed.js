import { MongoClient } from "mongodb";

const uri = "mongodb+srv://aisak:B0cQu1knBTYYF0Zq@cluster0.rjlin0p.mongodb.net/Rotation?retryWrites=true&w=majority&appName=Cluster0"
 // Set this in Vercel Environment Variables
const options = {};

const data = [
  {
    id: "K93",
    password: "password93",
    calls: 18,
    becameNextAt: new Date("2025-03-28T01:00:00.000Z"),
    nextUpTimestamp: new Date("2025-03-30T01:00:01.000Z"),
    lastCallTimestamp: new Date("2025-03-28T01:00:00.000Z"),
    active: true,
    imagePath: "/images/k93.jpg",
    order: 1
  },
  {
    id: "K95",
    password: "password95",
    calls: 7,
    becameNextAt: new Date("2025-03-25T09:00:00.000Z"),
    nextUpTimestamp: new Date("2025-03-27T09:00:01.000Z"),
    lastCallTimestamp: new Date("2025-03-25T09:00:00.000Z"),
    active: true,
    imagePath: "/images/k95.jpg",
    order: 4
  },
  {
    id: "K97",
    password: "password97",
    calls: 22,
    becameNextAt: new Date("2025-03-28T09:00:00.000Z"),
    nextUpTimestamp: new Date("2025-03-30T09:00:01.000Z"),
    lastCallTimestamp: new Date("2025-03-28T09:00:00.000Z"),
    active: true,
    imagePath: "/images/k97.jpg",
    order: 0
  },
  {
    id: "K96",
    password: "password96",
    calls: 11,
    becameNextAt: new Date("2025-03-28T17:00:00.000Z"),
    nextUpTimestamp: new Date("2025-03-30T17:00:01.000Z"),
    lastCallTimestamp: new Date("2025-03-28T17:00:00.000Z"),
    active: true,
    imagePath: "/images/k96.jpg",
    order: 3
  },
  {
    id: "K94",
    password: "password94",
    calls: 8,
    becameNextAt: new Date("2025-03-26T02:00:00.000Z"),
    nextUpTimestamp: new Date("2025-03-28T02:00:01.000Z"),
    lastCallTimestamp: new Date("2025-03-26T02:00:00.000Z"),
    active: true,
    imagePath: "/images/k94.jpg",
    order: 2
  },
  {
    id: "K91",
    password: "password91",
    calls: 0,
    becameNextAt: "",
    nextUpTimestamp: "",
    lastCallTimestamp: new Date("2025-03-28T10:23:00.000Z"),
    active: false,
    imagePath: "/images/k91.jpg",
    order: 5
  }
];

(async () => {
  const client = new MongoClient(uri, options);
  try {
    await client.connect();
    const db = client.db("Rotation"); // Replace with your actual database name
    const collection = db.collection("users"); // Replace with your actual collection name
    
    // Clear existing data (optional)
    await collection.deleteMany({});
    
    // Insert new data
    await collection.insertMany(data);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
})();
