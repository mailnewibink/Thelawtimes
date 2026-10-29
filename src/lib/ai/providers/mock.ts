import type { AiProvider } from "./types";
import type {
  AiTaskInput,
  AiTaskOutput,
  AiClaim,
  AiDocumentSummary,
  AiEntitiesAndTimeline,
  AiDraftResult,
  AiChecklistResult,
} from "@/types/ai";

/**
 * Deterministic Mock AI Provider used in automated testing and demo environments.
 * Delivers realistic, verified Indonesian legal analysis without external network calls.
 */
export class MockAiProvider implements AiProvider {
  readonly id = "mock" as const;
  readonly name = "Mock Legal Intelligence Engine";
  readonly defaultModel = "mock-law-v1";

  isAvailable(): boolean {
    return true;
  }

  async executeTask(input: AiTaskInput): Promise<AiTaskOutput> {
    const startTime = Date.now();
    const source = input.sourceRecord;
    const isEnglish = input.language === "en";

    const result: Partial<AiTaskOutput> = {};

    switch (input.taskType) {
      case "extract_claims": {
        const claims: AiClaim[] = [
          {
            claimText: isEnglish
              ? `The Supreme Court dismissed the cassation petition regarding ${source.title}.`
              : `Mahkamah Agung menolak permohonan kasasi terkait perkara ${source.title}.`,
            claimType: "holding",
            supportingSourceDocument: source.title,
            pageOrSection: "Amar Putusan Hal. 45",
            supportingExcerpt: "Menolak permohonan kasasi dari Pemohon Kasasi tersebut; Menghukum Pemohon Kasasi untuk membayar biaya perkara.",
            sourceUrl: source.canonicalUrl,
            verificationStatus: "verified",
            confidenceNotes: "Direct verbatim match against official decision text.",
          },
          {
            claimText: isEnglish
              ? "The commercial dispute originated from an alleged intellectual property trademark conflict."
              : "Sengketa komersial bermula dari dugaan pelanggaran hak merek dagang terdaftar.",
            claimType: "fact",
            supportingSourceDocument: source.title,
            pageOrSection: "Duduk Perkara",
            supportingExcerpt: "Bahwa Penggugat adalah pemilik sah merek terdaftar yang telah memiliki sertifikat resmi.",
            sourceUrl: source.canonicalUrl,
            verificationStatus: "verified",
            confidenceNotes: "Excerpt explicitly confirms trademark certificate issuance.",
          },
          {
            claimText: isEnglish
              ? "The defendant was alleged to have paid damages prior to the trial proceedings."
              : "Tergugat diduga telah membayarkan ganti rugi sebelum persidangan dimulai.",
            claimType: "fact",
            supportingSourceDocument: source.title,
            pageOrSection: "Eksepsi Tergugat",
            supportingExcerpt: "Tergugat menyatakan telah melakukan penyelesaian musyawarah.",
            sourceUrl: source.canonicalUrl,
            verificationStatus: "unverified",
            confidenceNotes: "Claim is contested between parties and lacks documented financial proof in available excerpt.",
          },
          {
            claimText: isEnglish
              ? "The ministry intervened directly as a third-party guarantor in the cassation trial."
              : "Kementerian melakukan intervensi langsung sebagai penjamin pihak ketiga dalam persidangan kasasi.",
            claimType: "general",
            supportingSourceDocument: source.title,
            pageOrSection: "Unknown",
            supportingExcerpt: undefined,
            sourceUrl: source.canonicalUrl,
            verificationStatus: "unsupported",
            confidenceNotes: "No factual mention of ministry intervention in the official record.",
          },
        ];
        result.claims = claims;
        break;
      }

      case "document_summary": {
        const summary: AiDocumentSummary = {
          documentType: source.sourceType === "regulation" ? "Statutory Regulation" : "Court Decision",
          facts: isEnglish
            ? [
                `The proceeding concerns ${source.title} registered under reference ${source.externalId || "N/A"}.`,
                "The controversy centers on statutory compliance and protection of priority rights.",
                "Both parties submitted evidence consisting of registered certificates and ministerial decrees.",
              ]
            : [
                `Perkara menyangkut ${source.title} yang terdaftar dengan nomor ${source.externalId || "N/A"}.`,
                "Pemeriksaan berfokus pada kepatuhan yuridis dan kepastian hak prioritas.",
                "Para pihak mengajukan alat bukti berupa sertifikat terdaftar dan surat keputusan kementerian.",
              ],
          proceduralHistory: isEnglish
            ? [
                "Initial petition submitted to the first-instance commercial court.",
                "Appeal examined and adjudicated with judgment confirming partial claims.",
                "Cassation petition lodged before the Supreme Court of the Republic of Indonesia.",
              ]
            : [
                "Gugatan awal didaftarkan pada Pengadilan Niaga tingkat pertama.",
                "Pemeriksaan tingkat banding menguatkan putusan tingkat pertama.",
                "Permohonan kasasi diajukan ke hadapan Mahkamah Agung Republik Indonesia.",
              ],
          issuesDiscussed: isEnglish
            ? [
                "Whether the contested registration infringed prior registered rights.",
                "The threshold of legal protection under current statutory gazettes.",
              ]
            : [
                "Apakah pendaftaran yang disengketakan melanggar hak terdaftar yang telah ada sebelumnya.",
                "Batasan perlindungan hukum di bawah peraturan perundang-undangan yang berlaku.",
              ],
          reasoning: isEnglish
            ? [
                "The judex facti did not err in the application of relevant statutory principles.",
                "The priority of first-to-file was verified through official institutional gazettes.",
              ]
            : [
                "Judex facti tidak salah menerapkan hukum dalam mempertimbangkan asas hukum yang relevan.",
                "Asas kepemilikan pertama (first-to-file) terbukti melalui warta resmi pendaftaran.",
              ],
          decisionOrConclusion: isEnglish
            ? "Cassation petition dismissed; lower court verdict sustained with legal costs assessed."
            : "Permohonan kasasi ditolak; putusan pengadilan tingkat sebelumnya dikuatkan dengan pembebanan biaya perkara.",
          keyDatesAndProvisions: [
            { label: "Tanggal Keputusan / Pengundangan", dateOrRef: source.sourceDate || "2026-10-15" },
            { label: "Ketentuan Utama", dateOrRef: "UU No. 20 Tahun 2016 jo. Pasal 1365 KUHPerdata" },
          ],
          missingOrUnclearInfo: isEnglish
            ? ["Detailed calculation of secondary damages not disclosed in available summary."]
            : ["Perincian ganti rugi immateriil tidak dicantumkan dalam salinan ringkasan putusan."],
        };
        result.summary = summary;
        break;
      }

      case "extract_entities_timeline": {
        const entitiesTimeline: AiEntitiesAndTimeline = {
          institutions: ["Mahkamah Agung Republik Indonesia", "Pengadilan Niaga Jakarta Pusat", "Kementerian Hukum dan HAM RI"],
          parties: ["Pemohon Kasasi (Penggugat Asal)", "Termohon Kasasi (Tergugat Asal)"],
          timeline: [
            { date: "2024-03-12", event: "Pendaftaran gugatan awal pada pengadilan tingkat pertama", sourceRef: "Duduk Perkara Par. 1" },
            { date: "2024-11-20", event: "Pembacaan putusan pengadilan tingkat pertama", sourceRef: "Salinan Putusan Hlm. 12" },
            { date: "2025-05-18", event: "Pernyataan permohonan kasasi resmi didaftarkan", sourceRef: "Akta Kasasi No. 04/KAS/2025" },
            { date: source.sourceDate || "2026-10-15", event: "Musyawarah majelis hakim agung dan pengucapan putusan kasasi", sourceRef: "Amar Putusan Hlm. 45" },
          ],
        };
        result.entitiesTimeline = entitiesTimeline;
        break;
      }

      case "generate_draft": {
        const draft: AiDraftResult = {
          template: input.template || "news",
          suggestedHeadlines: isEnglish
            ? [
                `Supreme Court Reaffirms Landmark Principles in ${source.title}`,
                `Judicial Broadsheet: Legal Implications of Recent Ruling in ${source.externalId || "Official Docket"}`,
              ]
            : [
                `Mahkamah Agung Tegaskan Kepastian Hukum dalam Perkara ${source.title}`,
                `Ulasan Yudisial: Putusan Kasasi ${source.externalId || "Resmi"} dan Perlindungan Hak Terdaftar`,
              ],
          deck: isEnglish
            ? "The bench held that registered statutory rights must remain protected against ungrounded subsequent challenges, reinforcing certainty for national commerce."
            : "Majelis Hakim Agung menegaskan bahwa hak terdaftar wajib dilindungi dari gugatan tak berdasar, memperkuat kepastian iklim usaha nasional.",
          bodyMarkdown: isEnglish
            ? `**JAKARTA —** The Supreme Court of the Republic of Indonesia has officially handed down its judgment in the matter of *${source.title}*, registered under docket number ${source.externalId || "N/A"}.\n\nIn its judicial considerations, the apex court observed that the lower courts applied established statutory doctrine with fidelity. The judgment firmly dismisses the petitioner's arguments regarding alleged procedural defects during prior proceedings.\n\nLegal observers emphasize that this precedent solidifies institutional trust across Indonesian administrative and commercial frameworks. All material conclusions cited herein are corroborated by the official gazette and court decree.`
            : `**JAKARTA —** Mahkamah Agung Republik Indonesia secara resmi telah memutus perkara *${source.title}*, yang terdaftar dengan nomor registrasi ${source.externalId || "N/A"}.\n\nDalam pertimbangan hukumnya, Majelis Hakim Agung berpendapat bahwa judex facti telah menerapkan hukum pembuktian secara tepat dan tidak melampaui kewenangannya. Putusan tersebut menegaskan penolakan atas seluruh dalil Pemohon Kasasi yang mendalilkan adanya kekeliruan prosedural pada persidangan sebelumnya.\n\nSejumlah pakar hukum menilai yurisprudensi ini memperkokoh kepastian hukum bagi pemegang hak terdaftar di Indonesia. Seluruh fakta dan amar putusan dalam laporan ini telah diverifikasi silang dengan salinan resmi pengadilan.`,
          relevantDates: [source.sourceDate || "2026-10-15"],
          institutions: ["Mahkamah Agung RI", "Pengadilan Niaga"],
          sourceLinks: [
            { label: source.title, url: source.canonicalUrl || "https://putusan3.mahkamahagung.go.id" },
          ],
          claims: [
            {
              claimText: `Mahkamah Agung menolak kasasi dalam perkara ${source.title}.`,
              claimType: "holding",
              supportingExcerpt: "Menolak permohonan kasasi dari Pemohon Kasasi.",
              verificationStatus: "verified",
              confidenceNotes: "Verbatim check against judgment decree.",
            },
          ],
          missingInfo: ["Besaran rincian eksekusi sukarela pihak termohon belum diumumkan ke publik."],
          suggestedCategories: ["Courts", "Legal News"],
          suggestedTags: ["Mahkamah Agung", "Kasasi", "Kepastian Hukum", "Yurisprudensi"],
          editorialChecklist: [
            "Periksa kembali nomor registrasi perkara pada direktori putusan resmi",
            "Pastikan tanggal pengucapan putusan sesuai dengan lembaran resmi pengadilan",
            "Konfirmasi status berkas telah berkekuatan hukum tetap (BHT)",
          ],
        };
        result.draft = draft;
        break;
      }

      case "verification_checklist": {
        const checklist: AiChecklistResult = {
          criticalStatements: [
            `Nomor registrasi perkara: ${source.externalId || "Wajib diverifikasi"}`,
            `Amar putusan akhir: Penolakan kasasi dengan pembebanan biaya perkara`,
            `Ketentuan undang-undang yang menjadi dasar pertimbangan hukum`,
          ],
          flaggedItems: [
            {
              item: "Klaim adanya kesepakatan damai sebelum persidangan",
              reason: "Tidak didukung bukti tertulis pada salinan putusan resmi",
              verificationRequired: true,
            },
            {
              item: "Status keterlibatan kementerian terkait",
              reason: "Tidak disebutkan sebagai pihak formil dalam berkas perkara",
              verificationRequired: true,
            },
          ],
        };
        result.checklist = checklist;
        break;
      }

      default: {
        result.metadata = {
          title: source.title,
          sourceType: source.sourceType,
          verifiedDate: source.sourceDate,
          externalId: source.externalId,
        };
      }
    }

    const durationMs = Date.now() - startTime;

    return {
      taskType: input.taskType,
      provider: "mock",
      model: this.defaultModel,
      ...result,
      inputTokens: 420,
      outputTokens: 580,
      durationMs,
    };
  }
}
