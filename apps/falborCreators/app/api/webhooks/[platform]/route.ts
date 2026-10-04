import { NextResponse } from "next/server";
import { getPlatformAdapter } from "@/lib/adapters";

export async function POST(req: Request, { params }: { params: { platform: string } }) {
  try {
    const payload = await req.json();
    const headers = Object.fromEntries(req.headers.entries());

    const adapter = getPlatformAdapter(params.platform as any);
    const event = await adapter.handleWebhook(payload, headers);

    if (event) {
      return NextResponse.json({ status: "processed", event });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error) {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
