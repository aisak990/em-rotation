import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const MONGO_URI = "mongodb+srv://itzbasatmaqsood:mj6THfVfpSn4CXW6@cluster0.1usflgg.mongodb.net/Client?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Client";

export async function POST(request) {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const { userId, password } = await request.json();

    // Find the user
    let user = await usersCollection.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Verify password
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    // Update user data
    const now = new Date().toISOString();
    await usersCollection.updateOne(
      { id: userId },
      { $inc: { calls: 1 }, $set: { lastCallTimestamp: now, active: true } }
    );

    // Fetch updated user
    user = await usersCollection.findOne({ id: userId });

    // Get all users, sorted by order
    const allUsers = await usersCollection.find({}).sort({ order: 1 }).toArray();

    // Separate active and inactive users
    const activeUsers = allUsers.filter((u) => u.active && u.id !== userId);
    const inactiveUsers = allUsers.filter((u) => !u.active);

    // Reorder users: move the calling user to the end of active users
    const updatedUsers = [...activeUsers, user, ...inactiveUsers];

    // Update `becameNextAt` and `nextUpTimestamp` for the first active user
    if (updatedUsers.length > 0 && updatedUsers[0].active) {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 30); // 30 hours in the future

      await usersCollection.updateOne(
        { id: updatedUsers[0].id },
        { $set: { becameNextAt: now, nextUpTimestamp: futureDate.toISOString() } }
      );
    }

    // Save the reordered users back to MongoDB with updated order values
    for (const [index, u] of updatedUsers.entries()) {
      await usersCollection.updateOne({ id: u.id }, { $set: { order: index } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing call:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
