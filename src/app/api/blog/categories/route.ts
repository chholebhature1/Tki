import { NextResponse } from "next/server";
import { BlogRepository } from "@/features/blog";

export async function GET() {
  const categories = await BlogRepository.getCategories();
  return NextResponse.json(categories);
}
