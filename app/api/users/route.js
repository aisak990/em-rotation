import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data")
    const fileContents = await fs.readFile(dataDirectory + "/data.json", "utf8")
    const data = JSON.parse(fileContents)

    return NextResponse.json({ users: data.users })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

