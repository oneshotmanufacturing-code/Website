import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "local-db.json");

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch {
    /* ignore */
  }
  return { messages: [] };
}

function writeDb(data: unknown) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = readDb();
    const newMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      company: company || "",
      message,
      created_at: new Date().toISOString(),
    };

    db.messages.unshift(newMessage);
    writeDb(db);

    return NextResponse.json({ success: true, data: newMessage });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ data: db.messages });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
