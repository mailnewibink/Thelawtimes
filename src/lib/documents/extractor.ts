import { inflateRawSync, inflateSync } from "node:zlib";
import type { DocumentExtractionOptions, DocumentExtractionResult, ExtractionStatus } from "./types";

const DEFAULT_MAX_CHARACTERS = 100_000;
const DEFAULT_MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

/**
 * Strips HTML tags and script/style contents, decoding common HTML entities.
 */
export function extractTextFromHtml(html: string, options?: DocumentExtractionOptions): DocumentExtractionResult {
  const maxChars = options?.maxCharacters ?? DEFAULT_MAX_CHARACTERS;
  
  // Remove script and style elements
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  
  // Replace line-breaking elements with line feeds
  cleaned = cleaned.replace(/<(?:p|br|div|tr|h[1-6]|li)\b[^>]*>/gi, "\n");
  
  // Strip all other HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–");

  // Normalize excessive whitespace
  cleaned = cleaned
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();

  const isTruncated = cleaned.length > maxChars;
  const finalText = isTruncated ? cleaned.slice(0, maxChars) : cleaned;
  const status: ExtractionStatus = finalText.length === 0 ? "empty" : isTruncated ? "partial" : "success";

  return {
    text: finalText,
    characterCount: finalText.length,
    status,
    mimeType: "text/html",
    provenance: options?.provenance || "html-source",
    isConfidential: false,
    warning: isTruncated ? `Content truncated at ${maxChars} characters.` : undefined,
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Extracts selectable text from plain text input.
 */
export function extractTextFromPlainText(text: string, options?: DocumentExtractionOptions): DocumentExtractionResult {
  const maxChars = options?.maxCharacters ?? DEFAULT_MAX_CHARACTERS;
  const normalized = text.trim();
  const isTruncated = normalized.length > maxChars;
  const finalText = isTruncated ? normalized.slice(0, maxChars) : normalized;
  const status: ExtractionStatus = finalText.length === 0 ? "empty" : isTruncated ? "partial" : "success";

  return {
    text: finalText,
    characterCount: finalText.length,
    status,
    mimeType: "text/plain",
    provenance: options?.provenance || "plain-text",
    isConfidential: false,
    warning: isTruncated ? `Content truncated at ${maxChars} characters.` : undefined,
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Lightweight text-stream parser for searchable/selectable PDF buffers without native C bindings.
 */
export function extractTextFromPdf(buffer: Buffer, options?: DocumentExtractionOptions): DocumentExtractionResult {
  const maxChars = options?.maxCharacters ?? DEFAULT_MAX_CHARACTERS;
  const provenance = options?.provenance || "pdf-document";

  if (buffer.length > (options?.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES)) {
    return {
      text: "",
      characterCount: 0,
      status: "error",
      mimeType: "application/pdf",
      provenance,
      isConfidential: false,
      warning: "PDF exceeds maximum permitted size of 15MB.",
      extractedAt: new Date().toISOString(),
    };
  }

  // Count page markers
  const pdfString = buffer.toString("binary");
  const pageMatches = pdfString.match(/\/Type\s*\/Page\b/g);
  const pageCountEstimate = pageMatches ? pageMatches.length : 1;

  const extractedSegments: string[] = [];

  // 1. Direct uncompressed text extraction: Tj and TJ operators
  const textPattern = /\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g;
  let match: RegExpExecArray | null;
  while ((match = textPattern.exec(pdfString)) !== null) {
    if (match[1]) {
      extractedSegments.push(match[1]);
    } else if (match[2]) {
      // Parse bracketed array of strings and positioning numbers
      const subParts = match[2].match(/\(([^)]*)\)/g);
      if (subParts) {
        const joined = subParts.map((s) => s.slice(1, -1)).join("");
        extractedSegments.push(joined);
      }
    }
  }

  // 2. Stream decompressed text: search for flate streams
  if (extractedSegments.length < 5) {
    const streamStartPattern = /stream\r?\n/g;
    let sMatch: RegExpExecArray | null;
    while ((sMatch = streamStartPattern.exec(pdfString)) !== null) {
      const startIdx = sMatch.index + sMatch[0].length;
      const endIdx = pdfString.indexOf("endstream", startIdx);
      if (endIdx > startIdx && endIdx - startIdx < 5_000_000) {
        const streamSlice = buffer.subarray(startIdx, endIdx);
        try {
          const decompressed = inflateSync(streamSlice).toString("latin1");
          let subMatch: RegExpExecArray | null;
          const subPattern = /\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g;
          while ((subMatch = subPattern.exec(decompressed)) !== null) {
            if (subMatch[1]) {
              extractedSegments.push(subMatch[1]);
            } else if (subMatch[2]) {
              const subParts = subMatch[2].match(/\(([^)]*)\)/g);
              if (subParts) {
                extractedSegments.push(subParts.map((s) => s.slice(1, -1)).join(""));
              }
            }
          }
        } catch {
          // Stream was not valid zlib or not text
        }
      }
    }
  }

  const rawText = extractedSegments.join(" ").replace(/\\([()\\])/g, "$1").trim();
  const isTruncated = rawText.length > maxChars;
  const finalText = isTruncated ? rawText.slice(0, maxChars) : rawText;

  const status: ExtractionStatus =
    finalText.length === 0
      ? "empty"
      : isTruncated
      ? "partial"
      : "success";

  return {
    text: finalText,
    characterCount: finalText.length,
    pageCountEstimate,
    status,
    mimeType: "application/pdf",
    provenance,
    isConfidential: false,
    warning:
      finalText.length === 0
        ? "No selectable text found in PDF. This document may be a scanned image requiring OCR."
        : isTruncated
        ? `PDF text truncated at ${maxChars} characters.`
        : undefined,
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Extracts plain text from Microsoft Word (.docx) files by decompressing word/document.xml.
 */
export function extractTextFromDocx(buffer: Buffer, options?: DocumentExtractionOptions): DocumentExtractionResult {
  const maxChars = options?.maxCharacters ?? DEFAULT_MAX_CHARACTERS;
  const provenance = options?.provenance || "docx-document";

  if (buffer.length > (options?.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES)) {
    return {
      text: "",
      characterCount: 0,
      status: "error",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      provenance,
      isConfidential: false,
      warning: "DOCX exceeds maximum permitted size of 15MB.",
      extractedAt: new Date().toISOString(),
    };
  }

  try {
    // DOCX is a zip file. Look for file entry 'word/document.xml'
    const docXmlIndex = buffer.indexOf(Buffer.from("word/document.xml"));
    if (docXmlIndex === -1) {
      return {
        text: "",
        characterCount: 0,
        status: "error",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        provenance,
        isConfidential: false,
        warning: "Invalid DOCX format: word/document.xml not found.",
        extractedAt: new Date().toISOString(),
      };
    }

    // Find the nearest preceding local file header (PK\x03\x04)
    let headerOffset = -1;
    for (let i = docXmlIndex; i >= Math.max(0, docXmlIndex - 256); i--) {
      if (buffer[i] === 0x50 && buffer[i + 1] === 0x4b && buffer[i + 2] === 0x03 && buffer[i + 3] === 0x04) {
        headerOffset = i;
        break;
      }
    }

    if (headerOffset === -1) {
      throw new Error("Local file header not found");
    }

    // Read header fields
    const fileNameLength = buffer.readUInt16LE(headerOffset + 26);
    const extraFieldLength = buffer.readUInt16LE(headerOffset + 28);
    const compressedSize = buffer.readUInt32LE(headerOffset + 18);
    const dataOffset = headerOffset + 30 + fileNameLength + extraFieldLength;

    const compressedSlice = buffer.subarray(dataOffset, dataOffset + (compressedSize || 5_000_000));
    const xmlContent = inflateRawSync(compressedSlice).toString("utf-8");

    // Extract text from <w:t> nodes and insert line breaks for <w:p>
    const text = xmlContent
      .replace(/<\/w:p>/gi, "\n\n")
      .replace(/<w:br\s*\/>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    const isTruncated = text.length > maxChars;
    const finalText = isTruncated ? text.slice(0, maxChars) : text;
    const status: ExtractionStatus = finalText.length === 0 ? "empty" : isTruncated ? "partial" : "success";

    return {
      text: finalText,
      characterCount: finalText.length,
      status,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      provenance,
      isConfidential: false,
      warning: isTruncated ? `DOCX text truncated at ${maxChars} characters.` : undefined,
      extractedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      text: "",
      characterCount: 0,
      status: "error",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      provenance,
      isConfidential: false,
      warning: `Failed to decompress DOCX: ${errorMsg}`,
      extractedAt: new Date().toISOString(),
    };
  }
}
