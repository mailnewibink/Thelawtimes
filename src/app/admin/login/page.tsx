"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { PaperDivider } from "@/components/ui/PaperDivider";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setErrorMsg("Supabase is not configured. Please check environment variables.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/demo-login", { method: "POST" });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg("Gagal mengaktifkan sesi demo.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="font-blackletter text-4xl sm:text-5xl text-ink font-normal mb-1">
          The Law Times
        </h1>
        <p className="kicker text-xs text-ink-muted">Editorial CMS & Publishing Console</p>
        <PaperDivider variant="hairline" className="my-4 max-w-xs mx-auto" />
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-2 border-ink bg-paper-light py-8 px-6 sm:px-10 shadow-sm">
          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="p-3 border border-ink bg-paper-dark/60 font-serif text-xs text-ink">
                <strong>Authentication Notice:</strong> {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="email" className="kicker block text-xs text-ink-muted mb-1.5">
                Editorial Account Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@thelawtimes.local"
                className="w-full border border-rule px-3 py-2 font-serif text-sm bg-white text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label htmlFor="password" className="kicker block text-xs text-ink-muted mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-rule px-3 py-2 font-serif text-sm bg-white text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full kicker border border-ink bg-ink text-paper py-2.5 px-4 text-xs hover:bg-paper hover:text-ink transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying Credentials..." : "Access Publishing Console"}
              </button>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[0.6875rem] text-ink-muted uppercase tracking-wider block mb-2 font-mono">
                — atau —
              </span>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full font-serif text-xs border border-dashed border-ink/40 bg-paper hover:bg-paper-dark text-ink py-2 px-3 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Masuk Mode Evaluasi Redaksi (Demo Editor)</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-rule-soft text-center">
            <p className="meta text-[0.6875rem] text-ink-muted leading-relaxed">
              Restricted to authorized newsroom personnel. All authentication attempts
              and security events are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
