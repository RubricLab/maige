import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { body } = req;
  console.log(body);
  return Response.json({ message: "Hello World" })
}