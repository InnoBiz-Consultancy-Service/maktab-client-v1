import { getSession } from "@/lib/api/cookies";
import { getLeaderboardAction } from "@/actions/dashboard/leaderboard";
import { getInstituteDashboardBatchesAction } from "@/actions/dashboard/institute-dashboard";
import { getTeacherDashboardStudentsAction } from "@/actions/dashboard/teacher-dashboard";
import { getParentChildrenDashboardAction } from "@/actions/dashboard/parent-dashboard";
import {
  getStudentHomeworks,
  getStudentHomeworkOverview,
} from "@/actions/homework";
import { universalApi } from "@/actions/universal-api";
import { LeaderboardView } from "@/components/dashboard/leaderboard/LeaderboardView";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    scope?: "batch" | "institute";
    batchId?: string;
    period?: "weekly" | "monthly" | "alltime";
  }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const userRole = session?.role || "STUDENT";

  // For STUDENT and PARENT roles, scope must ALWAYS be "batch" (institute-wide is forbidden by backend API rules)
  const isRestrictedRole = userRole === "STUDENT" || userRole === "PARENT";
  const scope: "batch" | "institute" = isRestrictedRole
    ? "batch"
    : params.scope ||
      (userRole === "INSTITUTE" || userRole === "ADMIN"
        ? "institute"
        : "batch");
  const period = params.period || "alltime";

  // Fetch batches list based on role
  let batches: { id: string; name: string }[] = [];

  if (userRole === "INSTITUTE" || userRole === "ADMIN") {
    const batchRes = await getInstituteDashboardBatchesAction();
    if (batchRes.ok && batchRes.data) {
      batches = batchRes.data.map((b) => ({ id: b.id, name: b.name }));
    }
  } else if (userRole === "TEACHER") {
    const teacherStudentsRes = await getTeacherDashboardStudentsAction({
      limit: 100,
    });
    if (teacherStudentsRes.ok && teacherStudentsRes.data?.result) {
      const batchMap = new Map<string, string>();
      teacherStudentsRes.data.result.forEach((s) => {
        s.batches?.forEach((b) => batchMap.set(b.id, b.name));
      });
      batches = Array.from(batchMap.entries()).map(([id, name]) => ({
        id,
        name,
      }));
    }
  } else if (userRole === "PARENT") {
    const childrenRes = await getParentChildrenDashboardAction();
    if (childrenRes.ok && childrenRes.data) {
      const batchMap = new Map<string, string>();
      childrenRes.data.forEach((c) => {
        if (c.batch?.id && c.batch?.name) {
          batchMap.set(c.batch.id, c.batch.name);
        }
      });
      batches = Array.from(batchMap.entries()).map(([id, name]) => ({
        id,
        name,
      }));
    }
  } else if (userRole === "STUDENT") {
    // 1. Try student homeworks list
    const studentHwListRes = await getStudentHomeworks();
    if (studentHwListRes.ok && Array.isArray(studentHwListRes.data)) {
      const batchMap = new Map<string, string>();
      studentHwListRes.data.forEach((item: any) => {
        const bId =
          item.batchId ||
          item.batch?.id ||
          item.homework?.batchId ||
          item.homework?.batch?.id;
        const bName =
          item.batchName ||
          item.batch?.name ||
          item.homework?.batchName ||
          item.homework?.batch?.name ||
          "My Batch";
        if (bId) batchMap.set(bId, bName);
      });
      batches = Array.from(batchMap.entries()).map(([id, name]) => ({
        id,
        name,
      }));
    }

    // 2. Fallback to student overview if no batch found yet
    if (batches.length === 0) {
      const studentHwRes = await getStudentHomeworkOverview();
      if (studentHwRes.ok && studentHwRes.data) {
        const hwData = studentHwRes.data as any;
        const bId = hwData.batch?.id || hwData.homeworks?.[0]?.batchId;
        const bName = hwData.batch?.name || "My Batch";
        if (bId) batches = [{ id: bId, name: bName }];
      }
    }

    // 3. Fallback to direct API call if still empty
    if (batches.length === 0) {
      try {
        const apiRes = await universalApi<any>({
          endpoint: "/students/me",
          method: "GET",
        });
        if (apiRes.success && apiRes.data) {
          const profile = apiRes.data.data || apiRes.data;
          const bId =
            profile.batchId || profile.batch?.id || profile.batches?.[0]?.id;
          const bName =
            profile.batch?.name || profile.batches?.[0]?.name || "My Batch";
          if (bId) batches = [{ id: bId, name: bName }];
        }
      } catch (e) {}
    }
  }

  const initialBatchId = params.batchId || batches[0]?.id || "";

  // Call initial leaderboard action with batch scope if batchId is available
  let initialData;
  if (initialBatchId || scope === "institute") {
    const initialRes = await getLeaderboardAction({
      scope,
      period,
      ...(scope === "batch" && initialBatchId
        ? { batchId: initialBatchId }
        : {}),
    });
    if (initialRes.ok) {
      initialData = initialRes.data;
    }
  }

  return (
    <LeaderboardView
      initialData={initialData}
      batches={batches}
      userRole={userRole}
      defaultBatchId={initialBatchId}
    />
  );
}
