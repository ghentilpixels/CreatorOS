import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "auth_callback_failed");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
