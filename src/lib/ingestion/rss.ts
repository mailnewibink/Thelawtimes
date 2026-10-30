import { XMLParser } from "fast-xml-parser";
import { isSafeOfficialUrl, computeRecordHash, type NormalizedSourceRecord } from "./types";

export interface ParsedRssFeed {
  title: string;
  description: string;
  link: string;
  items: NormalizedSourceRecord[];
}

/**
 * Robust, server-side RSS & Atom feed parser.
 * Extracts title, link, published date, summary, and safely permitted images.
 */
export async function parseRssFeed(feedUrl: string, sourceName?: string): Promise<ParsedRssFeed> {
  if (!isSafeOfficialUrl(feedUrl)) {
    throw new Error(`Feed URL tidak diizinkan atau tidak valid: ${feedUrl}`);
  }

  const res = await fetch(feedUrl, {
    headers: {
      "User-Agent": "TheLawTimes-NewsAggregator/1.0 (+https://thelawtimes.com)",
      Accept: "application/rss+xml, application/rdf+xml, application/atom+xml, application/xml, text/xml",
    },
    signal: AbortSignal.timeout(10000), // 10s timeout
  });

  if (!res.ok) {
    throw new Error(`Gagal mengunduh feed: ${res.status} ${res.statusText}`);
  }

  const xmlText = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  const parsed = parser.parse(xmlText);
  const channel = parsed.rss?.channel || parsed["rdf:RDF"]?.channel || parsed.feed;

  if (!channel) {
    throw new Error("Format feed tidak dikenali sebagai RSS 2.0 atau Atom.");
  }

  const feedTitle = channel.title || sourceName || "Sumber Hukum Eksternal";
  const feedDesc = channel.description || channel.subtitle || "";
  const feedLink = channel.link?.["@_href"] || channel.link || "";

  // Extract items (can be array or single object)
  let rawItems = channel.item || channel.entry || [];
  if (!Array.isArray(rawItems)) {
    rawItems = [rawItems];
  }

  const items: NormalizedSourceRecord[] = [];

  for (const item of rawItems) {
    const title = typeof item.title === "string" ? item.title : item.title?.["#text"] || "";
    if (!title) continue;

    // Link resolution
    let link = "";
    if (typeof item.link === "string") {
      link = item.link;
    } else if (item.link?.["@_href"]) {
      link = item.link["@_href"];
    } else if (item.guid && typeof item.guid === "string" && item.guid.startsWith("http")) {
      link = item.guid;
    }

    // Publication date
    const dateStr = item.pubDate || item.published || item.updated || item["dc:date"] || null;
    let isoDate: string | null = null;
    if (dateStr) {
      try {
        isoDate = new Date(dateStr).toISOString();
      } catch {
        isoDate = null;
      }
    }

    // Excerpt / description
    let rawSummary =
      item.description || item.summary?.["#text"] || item.summary || item["content:encoded"] || "";
    if (typeof rawSummary !== "string") {
      rawSummary = "";
    }
    // Clean HTML tags from summary
    const cleanSummary = rawSummary
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 320);

    // Permitted image url (enclosure or media:content)
    let imageUrl: string | null = null;
    if (item.enclosure?.["@_type"]?.startsWith("image/")) {
      imageUrl = item.enclosure["@_url"] || null;
    } else if (item["media:content"]?.["@_url"]) {
      imageUrl = item["media:content"]["@_url"] || null;
    }

    const externalId = link || item.guid || `${title}-${isoDate || "undated"}`;
    const contentHash = computeRecordHash({
      externalId,
      title,
      date: isoDate,
      url: link,
      rawContent: cleanSummary,
    });

    items.push({
      externalId,
      title,
      recordType: "external_news",
      sourceDate: isoDate,
      canonicalUrl: link,
      rawDocumentUrl: null,
      summaryAbstract: cleanSummary || null,
      metadata: {
        sourceName: feedTitle,
        imageUrl,
      },
      contentHash,
    });
  }

  return {
    title: feedTitle,
    description: feedDesc,
    link: typeof feedLink === "string" ? feedLink : "",
    items,
  };
}
