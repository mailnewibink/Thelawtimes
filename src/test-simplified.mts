import { describe, it } from "node:test";
import assert from "node:assert";
import {
  fetchClientPublications,
  fetchGeneralNews,
  searchPublishedArticles,
  fetchArticleBySlug,
} from "./lib/repositories/articles";
import { demoArticles } from "./data/demo/articles";

describe("Simplified Implementation: Legal News Portal & Client Publications", () => {
  it("1. Should prioritize client-case publications on homepage and listing", async () => {
    const clientPubs = await fetchClientPublications(5);
    assert.ok(clientPubs.length > 0, "Must return at least 1 client publication");

    const topClientPub = clientPubs[0];
    assert.strictEqual(
      topClientPub.publicationType,
      "client_publication",
      "Top client publication must have publicationType = 'client_publication'"
    );
    assert.ok(topClientPub.headline.length > 10);
    assert.ok(topClientPub.slug.length > 5);
  });

  it("2. Should distinguish general legal news from client publications", async () => {
    const generalNews = await fetchGeneralNews(5);
    assert.ok(generalNews.length > 0, "Must return general legal news");

    const generalItem = generalNews.find((a) => a.publicationType === "general_news");
    assert.ok(generalItem, "Must contain general news publications");
    assert.notStrictEqual(generalItem.id, "art-client-001");
  });

  it("3. Search and filter: Keywords and publication type segregation", async () => {
    // Search by title keyword
    const searchRes = await searchPublishedArticles({
      query: "Mahkamah Agung",
    });
    assert.ok(searchRes.total > 0, "Search for 'Mahkamah Agung' should yield matching articles");
    assert.ok(
      searchRes.articles.some((a) =>
        a.headline.toLowerCase().includes("mahkamah agung") ||
        a.body.some((p) => p.toLowerCase().includes("mahkamah agung"))
      )
    );

    // Filter by publicationType = 'client_publication'
    const clientSearch = await searchPublishedArticles({
      publicationType: "client_publication",
    });
    assert.ok(clientSearch.total > 0);
    assert.ok(
      clientSearch.articles.every((a) => a.publicationType === "client_publication"),
      "Every filtered item must be a client_publication"
    );

    // Filter by publicationType = 'general_news'
    const newsSearch = await searchPublishedArticles({
      publicationType: "general_news",
    });
    assert.ok(newsSearch.total > 0);
    assert.ok(
      newsSearch.articles.every((a) => a.publicationType === "general_news"),
      "Every filtered item must be general_news"
    );
  });

  it("4. Article detail mapping supports document URL and source attribution", async () => {
    const article = await fetchArticleBySlug("putusan-kasasi-mahkamah-agung-sengketa-merek-dagang");
    assert.ok(article, "Client publication slug must resolve");
    assert.strictEqual(article.publicationType, "client_publication");
    assert.ok(article.sourceName, "Must include official source name");
    assert.ok(article.sourceUrl, "Must include official source URL");
    assert.ok(article.documentUrl, "Must include official document attachment URL");
  });

  it("5. Editorial transparency: client publications must never masquerade as ungrounded news", () => {
    const clientItems = demoArticles.filter((a) => a.publicationType === "client_publication");
    assert.ok(clientItems.length >= 2, "Demo dataset must include client case announcements");

    for (const item of clientItems) {
      assert.strictEqual(item.publicationType, "client_publication");
      assert.ok(
        item.byline?.includes("Klien") || item.byline?.includes("Kuasa Hukum") || item.byline?.includes("Publikasi"),
        "Client publications must display clear origin byline"
      );
    }
  });
});
