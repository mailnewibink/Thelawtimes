import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("tlt_demo_session");

    const supabase = await getSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
