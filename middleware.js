import { NextResponse } from "next/server"

export function middleware(request) {
  // This middleware is empty but can be used for authentication or other purposes
  return NextResponse.next()
}

