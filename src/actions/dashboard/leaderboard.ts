"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type {
  LeaderboardQueryParams,
  LeaderboardData,
  BatchCompleteData,
  FinalLeaderboardData,
} from "@/types/dashboard";

function unwrap<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data !== undefined
  ) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

/**
 * 7.1 GET /leaderboard
 * Query params: scope (batch|institute), batchId (required if scope=batch), period (weekly|monthly|alltime)
 */
export async function getLeaderboardAction(
  params: LeaderboardQueryParams,
): Promise<ActionResult<LeaderboardData>> {
  const query = new URLSearchParams();
  const effectiveScope = (params.scope === "batch" && !params.batchId) ? "institute" : params.scope;
  query.set("scope", effectiveScope);
  if (effectiveScope === "batch" && params.batchId) query.set("batchId", params.batchId);
  if (params.period) query.set("period", params.period);

  const endpoint = `/leaderboard?${query.toString()}`;

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load leaderboard.",
    };
  }

  return { ok: true, data: unwrap<LeaderboardData>(result.data) };
}

/**
 * 8.1 PATCH /batches/:id/complete
 * Mark batch complete & freeze final leaderboard. (Role: INSTITUTE or assigned TEACHER)
 */
export async function completeBatchAction(
  batchId: string,
): Promise<ActionResult<BatchCompleteData>> {
  const result = await universalApi<unknown>({
    endpoint: `/batches/${batchId}/complete`,
    method: "PATCH",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not complete batch.",
    };
  }

  return { ok: true, data: unwrap<BatchCompleteData>(result.data) };
}

/**
 * 8.2 GET /batches/:id/final-leaderboard
 * Fetch permanent frozen leaderboard standings for a completed batch.
 */
export async function getFinalLeaderboardAction(
  batchId: string,
): Promise<ActionResult<FinalLeaderboardData>> {
  const result = await universalApi<unknown>({
    endpoint: `/batches/${batchId}/final-leaderboard`,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load final leaderboard.",
    };
  }

  return { ok: true, data: unwrap<FinalLeaderboardData>(result.data) };
}
