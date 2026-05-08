import { NextResponse } from "next/server";
import { getGithubRepos } from "@/lib/github";

export async function GET() {
  try {
    const repos = await getGithubRepos();
    return NextResponse.json(repos);
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
