"use client";

import { useState } from "react";
import { Play, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SourceItem {
  id: string;
  name: string;
  institution: string | null;
  source_type: string;
  access_method: string;
  is_enabled: boolean;
  polling_interval_minutes: number;
  last_successful_run: string | null;
  last_error: string | null;
}

export function SourceListTable({ initialSources }: { initialSources: SourceItem[] }) {
  const [sources] = useState(initialSources);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const handleManualSync = async (sourceId: string) => {
    setSyncingId(sourceId);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to trigger ingestion.");
      }

      setFeedback({
        id: sourceId,
        success: data.status === "success" || data.status === "partial",
        msg: `Batch synced: ${data.recordsFound} found (${data.recordsNew} new, ${data.recordsUpdated} updated).`,
      });
    } catch (err: unknown) {
      setFeedback({
        id: sourceId,
        success: false,
        msg: err instanceof Error ? err.message : "Sync error.",
      });
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`p-3 border text-xs font-serif flex items-center gap-2 ${
            feedback.success
              ? "border-green-800 bg-green-50 text-green-900"
              : "border-red-800 bg-red-50 text-red-900"
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Source Name & Institution</th>
              <th className="p-3">Type</th>
              <th className="p-3">Access Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Polling Interval</th>
              <th className="p-3">Last Sync</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {sources.map((src) => {
              const isSyncing = syncingId === src.id;

              return (
                <tr key={src.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-ink">{src.name}</p>
                    <p className="meta text-[0.6875rem] text-ink-muted">{src.institution || "—"}</p>
                  </td>
                  <td className="p-3 uppercase font-sans text-[0.625rem] text-ink-muted">
                    {src.source_type}
                  </td>
                  <td className="p-3 font-mono text-[0.6875rem]">
                    <span
                      className={`px-1.5 py-0.5 border ${
                        src.access_method === "api"
                          ? "border-blue-700 bg-blue-50 text-blue-900"
                          : "border-rule text-ink-muted"
                      }`}
                    >
                      {src.access_method.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`kicker text-[0.625rem] px-2 py-0.5 border ${
                        src.is_enabled
                          ? "border-green-800 bg-green-50 text-green-900 font-bold"
                          : "border-rule text-ink-muted"
                      }`}
                    >
                      {src.is_enabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-ink-muted">
                    {src.polling_interval_minutes ? `${src.polling_interval_minutes}m` : "Manual"}
                  </td>
                  <td className="p-3 meta text-ink-muted">
                    {src.last_successful_run
                      ? formatDate(src.last_successful_run.substring(0, 10), "short")
                      : "Never"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => handleManualSync(src.id)}
                      className="kicker text-[0.625rem] border border-ink bg-ink text-paper px-2.5 py-1 hover:bg-paper hover:text-ink transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Trigger Batch</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
