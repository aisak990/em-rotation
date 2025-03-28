import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { userId, password } = await request.json()

    // Read the current data
    const dataDirectory = path.join(process.cwd(), "data")
    const fileContents = await fs.readFile(dataDirectory + "/data.json", "utf8")
    const data = JSON.parse(fileContents)

    // Find the user
    const userIndex = data.users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const user = data.users[userIndex]

    // Verify password
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }

    // Update user data
    const now = new Date().toISOString()

    user.calls += 1
    user.lastCallTimestamp = now

    // Reorder users for rotation
    // Remove the user from their current position
    data.users.splice(userIndex, 1)

    // Add the user to the end of the active users
    const activeUsers = data.users.filter((u) => u.active)
    const inactiveUsers = data.users.filter((u) => !u.active)

    // If the user was inactive, make them active
    if (!user.active) {
      user.active = true
    }

    // Recombine the arrays with the user at the end of active users
    data.users = [...activeUsers, user, ...inactiveUsers]

    // Update the nextUpTimestamp for the new first user
    if (data.users.length > 0 && data.users[0].active) {
      // Set the current time as when this user became next
      data.users[0].becameNextAt = now

      // Set a future timestamp for when they'll no longer be next
      // This is just for demonstration - in a real app you might have specific rules
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 30) // 30 hours in the future
      data.users[0].nextUpTimestamp = futureDate.toISOString()
    }

    // Write the updated data back to the file
    await fs.writeFile(dataDirectory + "/data.json", JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing call:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

