import { describe, it } from "node:test";
import assert from "node:assert";
import { isSupabaseConfigured } from "./lib/supabase/config";
import { fetchPublishedArticles, fetchArticleBySlug } from "./lib/repositories/articles";
import { fetchPublicCases, fetchCaseBySlug } from "./lib/repositories/cases";
import { fetchPublishedAnnouncements } from "./lib/repositories/announcements";
import { fetchPublishedRegulations } from "./lib/repositories/regulations";

describe("Supabase Integration & Repository Verification", () => {
  it("should report configuration status accurately without throwing", () => {
    const configured = isSupabaseConfigured();
    assert.strictEqual(typeof configured, "boolean");
    assert.strictEqual(configured, false, "Should be false when env keys are empty");
  });

  it("should fall back gracefully to demo articles when unconfigured", async () => {
    const articles = await fetchPublishedArticles("legal-news");
    assert.ok(articles.length > 0, "Should return demo articles");
    assert.strictEqual(articles[0].provenance.isDemo, true);

    const article = await fetchArticleBySlug(articles[0].slug);
    assert.ok(article, "Should find article by slug");
    assert.strictEqual(article?.slug, articles[0].slug);
  });

  it("should fall back gracefully to demo cases when unconfigured", async () => {
    const cases = await fetchPublicCases();
    assert.ok(cases.length > 0, "Should return demo cases");
    assert.strictEqual(cases[0].provenance.isDemo, true);

    const singleCase = await fetchCaseBySlug(cases[0].slug);
    assert.ok(singleCase, "Should find case by slug");
    assert.strictEqual(singleCase?.slug, cases[0].slug);
  });

  it("should fall back gracefully to demo announcements when unconfigured", async () => {
    const announcements = await fetchPublishedAnnouncements();
    assert.ok(announcements.length > 0, "Should return demo announcements");
    assert.strictEqual(announcements[0].provenance.isDemo, true);
  });

  it("should fall back gracefully to demo regulations when unconfigured", async () => {
    const regulations = await fetchPublishedRegulations();
    assert.ok(regulations.length > 0, "Should return demo regulations");
    assert.strictEqual(regulations[0].provenance.isDemo, true);
  });
});
