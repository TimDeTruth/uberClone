import { neon } from "@neondatabase/serverless";

//get all drivers
export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;
    return Response.json({ data: response });
  } catch (error) {
    return Response.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}
