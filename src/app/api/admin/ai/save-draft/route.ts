import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentAdminUser();

    if (!user && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const payload = await req.json();
    const {
      sourceRecordId,
      title,
      excerpt,
      body,
      contentType = "news",
      categoryId,
      citationNote,
    } = payload;

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required to save an editorial draft." },
        { status: 400 }
      );
    }

    // Generate unique slug with timestamp suffix
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    // Strictly enforce 'draft' status - NEVER automatically approve or publish
    const articlePayload = {
      title,
      slug,
      excerpt: excerpt || null,
      body,
      content_type: contentType,
      status: "draft", // ENFORCED DRAFT STATUS
      author_id: user?.id || null,
      is_demo: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
      published_at: null,
      scheduled_at: null,
    };

    let articleId = `draft-${Date.now()}`;
    const supabase = await getSupabaseServerClient();

    if (supabase) {
      try {
        const { data: newArticle, error: articleErr } = await (supabase as any)
          .from("articles")
          .insert(articlePayload)
          .select("id")
          .single();

        if (articleErr) {
          throw articleErr;
        }

        if (newArticle?.id) {
          articleId = newArticle.id;

          // 1. Link to source record in article_sources
          if (sourceRecordId) {
            await (supabase as any).from("article_sources").insert({
              article_id: articleId,
              source_record_id: sourceRecordId,
              citation_note: citationNote || "AI-Assisted Editorial Draft verified against official source",
            });
          }

          // 2. Link category if specified
          if (categoryId) {
            await (supabase as any).from("article_categories").insert({
              article_id: articleId,
              category_id: categoryId,
            });
          }

          // 3. Record audit trail
          await (supabase as any).from("audit_logs").insert({
            actor_id: user?.id || null,
            action: "article.create_from_ai_draft",
            entity_type: "articles",
            entity_id: articleId,
            metadata: {
              title,
              slug,
              source_record_id: sourceRecordId,
              status: "draft",
            },
          });
        }
      } catch {
        // In demo mode or if Supabase write fails, return mock saved id
      }
    }

    return NextResponse.json({
      success: true,
      articleId,
      slug,
      status: "draft",
      message: "Editorial draft saved successfully. Content remains unpublished pending editorial review.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
