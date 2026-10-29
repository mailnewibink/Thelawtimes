import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AuditLogParams {
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  actorId?: string | null;
}

/**
 * Server-side audit logging helper.
 * Records administrative and editorial changes securely.
 */
export async function logAuditEvent({
  action,
  entityType,
  entityId,
  metadata = {},
  actorId,
}: AuditLogParams): Promise<void> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return;

    let resolvedActorId = actorId;
    if (!resolvedActorId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      resolvedActorId = user?.id || null;
    }

    await (supabase as any).from("audit_logs").insert({
      actor_id: resolvedActorId,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      metadata,
    });
  } catch (err) {
    console.error("[AuditLog] Failed to record audit log:", err);
  }
}
