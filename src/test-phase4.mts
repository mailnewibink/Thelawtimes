import { describe, it } from "node:test";
import assert from "node:assert";
import { computeRecordHash, isSafeOfficialUrl } from "./lib/ingestion/types";
import { MahkamahAgungConnector } from "./lib/ingestion/adapters/ma-putusan";
import { JdihnConnector } from "./lib/ingestion/adapters/jdihn";
import { sourceRegistry } from "./lib/ingestion/registry";

describe("Phase 4: Official Source Ingestion Pipeline Verification", () => {
  it("should validate safe and unsafe official URLs correctly (SSRF protection)", () => {
    assert.strictEqual(isSafeOfficialUrl("https://putusan3.mahkamahagung.go.id"), true);
    assert.strictEqual(isSafeOfficialUrl("https://jdihn.go.id/dokumen/123"), true);
    
    // Malicious or private endpoints must be rejected
    assert.strictEqual(isSafeOfficialUrl("http://localhost:3000/api"), false);
    assert.strictEqual(isSafeOfficialUrl("http://127.0.0.1/private"), false);
    assert.strictEqual(isSafeOfficialUrl("http://192.168.1.1/admin"), false);
    assert.strictEqual(isSafeOfficialUrl("http://10.0.0.1/secret"), false);
    assert.strictEqual(isSafeOfficialUrl("ftp://malicious-file.com"), false);
    assert.strictEqual(isSafeOfficialUrl("not-a-valid-url"), false);
  });

  it("should calculate deterministic content hashes for change detection", () => {
    const hash1 = computeRecordHash({
      externalId: "PUT-001",
      title: "Putusan Sengketa Merek",
      date: "2026-10-20",
    });

    const hash2 = computeRecordHash({
      externalId: "PUT-001",
      title: "Putusan Sengketa Merek",
      date: "2026-10-20",
    });

    const hashChanged = computeRecordHash({
      externalId: "PUT-001",
      title: "Putusan Sengketa Merek (Amended)",
      date: "2026-10-20",
    });

    assert.strictEqual(typeof hash1, "string");
    assert.strictEqual(hash1.length, 64, "SHA-256 hash length");
    assert.strictEqual(hash1, hash2, "Identical inputs must produce identical hash");
    assert.notStrictEqual(hash1, hashChanged, "Changed content must yield different hash");
  });

  it("should have registered all primary candidate connectors", () => {
    const connectors = sourceRegistry.list();
    assert.ok(connectors.length >= 3, "Expected at least 3 candidate adapters");

    const ma = sourceRegistry.get("ma-putusan");
    assert.ok(ma, "Mahkamah Agung adapter must exist");
    assert.strictEqual(ma?.accessMethod, "api");

    const jdihn = sourceRegistry.get("jdihn-regulation");
    assert.ok(jdihn, "JDIHN adapter must exist");
    assert.strictEqual(jdihn?.accessMethod, "api");

    const manual = sourceRegistry.get("manual-import");
    assert.ok(manual, "Manual import adapter must exist");
    assert.strictEqual(manual?.accessMethod, "manual");
  });

  it("should fetch mock bounded batch from Mahkamah Agung adapter", async () => {
    const connector = new MahkamahAgungConnector();
    const batch = await connector.fetchBatch({ batchSize: 2 });
    assert.ok(batch.recordsFound >= 2);
    assert.strictEqual(batch.records[0].recordType, "court_decision");
    assert.ok(batch.records[0].contentHash);
  });

  it("should fetch mock bounded batch from JDIHN adapter", async () => {
    const connector = new JdihnConnector();
    const batch = await connector.fetchBatch({ batchSize: 2 });
    assert.ok(batch.recordsFound >= 2);
    assert.strictEqual(batch.records[0].recordType, "regulation");
    assert.ok(batch.records[0].contentHash);
  });
});
