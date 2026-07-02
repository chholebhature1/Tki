import { NextResponse } from "next/server";
import { BlogRepository } from "@/features/blog";

export async function GET() {
  const tags = await BlogRepository.getTags();
  return NextResponse.json(tags);
}
