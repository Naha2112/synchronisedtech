import { NextResponse } from "next/server"
import { createConnection } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), "lib", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .filter((statement) => statement.trim() !== "")
      .map((statement) => statement.trim() + ";")

    // Execute each statement
    const connection = await createConnection()

    for (const statement of statements) {
      await connection.execute(statement)
    }

    await connection.end()

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      { success: false, message: "Database setup failed", error: String(error) },
      { status: 500 },
    )
  }
}
