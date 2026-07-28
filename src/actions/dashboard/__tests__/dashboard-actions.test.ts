import { getInstituteDashboardOverviewAction, getInstituteDashboardBatchesAction, getInstituteDashboardStudentsAction, getInstituteStudentDetailAction, getInstituteTeachersDashboardAction, getInstituteTeacherDetailAction } from "../institute-dashboard";
import { getTeacherDashboardOverviewAction, getTeacherDashboardStudentsAction, getTeacherStudentDetailAction } from "../teacher-dashboard";
import { getParentChildrenDashboardAction, getParentChildDetailDashboardAction } from "../parent-dashboard";
import { getLeaderboardAction, completeBatchAction, getFinalLeaderboardAction } from "../leaderboard";
import { universalApi } from "@/actions/universal-api";

jest.mock("@/actions/universal-api", () => ({
  universalApi: jest.fn(),
}));

const mockUniversalApi = universalApi as jest.MockedFunction<typeof universalApi>;

describe("Dashboard & Leaderboard Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Institute Dashboard Actions", () => {
    it("getInstituteDashboardOverviewAction calls /institutes/dashboard/overview", async () => {
      const mockData = {
        counts: { teachers: 12, students: 240, batches: 8, activeBatches: 6, completedBatches: 2 },
        progress: { lessonCompletionRate: 72, homeworkSubmissionRate: 81, attendanceRate: 89 },
      };
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: mockData },
      });

      const res = await getInstituteDashboardOverviewAction();
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.counts.students).toBe(240);
        expect(res.data.progress.lessonCompletionRate).toBe(72);
      }
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/institutes/dashboard/overview",
        method: "GET",
      });
    });

    it("getInstituteDashboardBatchesAction calls /institutes/dashboard/batches", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: [{ id: "b1", name: "Batch A" }] },
      });

      const res = await getInstituteDashboardBatchesAction();
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/institutes/dashboard/batches",
        method: "GET",
      });
    });

    it("getInstituteDashboardStudentsAction appends query parameters", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: { meta: { page: 1, limit: 20, total: 1, totalPages: 1 }, result: [] } },
      });

      const res = await getInstituteDashboardStudentsAction({
        search: "Abdullah",
        sortBy: "rank",
        sortOrder: "asc",
      });
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/institutes/dashboard/students?search=Abdullah&sortBy=rank&sortOrder=asc",
        method: "GET",
      });
    });
  });

  describe("Teacher Dashboard Actions", () => {
    it("getTeacherDashboardOverviewAction calls /teachers/dashboard/overview", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: { counts: { batches: 2, students: 54 }, progress: { lessonRate: 74, homeworkRate: 80, attendanceRate: 90 } } },
      });

      const res = await getTeacherDashboardOverviewAction();
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/teachers/dashboard/overview",
        method: "GET",
      });
    });
  });

  describe("Parent Dashboard Actions", () => {
    it("getParentChildrenDashboardAction calls /parents/dashboard/children", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: [{ id: "s1", name: "Child 1", points: 340 }] },
      });

      const res = await getParentChildrenDashboardAction();
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/parents/dashboard/children",
        method: "GET",
      });
    });
  });

  describe("Leaderboard Actions", () => {
    it("getLeaderboardAction formats query parameters correctly", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: { scope: "batch", period: "weekly", entries: [] } },
      });

      const res = await getLeaderboardAction({
        scope: "batch",
        batchId: "b_123",
        period: "weekly",
      });
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/leaderboard?scope=batch&batchId=b_123&period=weekly",
        method: "GET",
      });
    });

    it("completeBatchAction issues PATCH to /batches/:id/complete", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: { batchId: "b_123", status: "COMPLETED" } },
      });

      const res = await completeBatchAction("b_123");
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/batches/b_123/complete",
        method: "PATCH",
      });
    });

    it("getFinalLeaderboardAction calls /batches/:id/final-leaderboard", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { success: true, message: "OK", data: { batchId: "b_123", entries: [] } },
      });

      const res = await getFinalLeaderboardAction("b_123");
      expect(res.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/batches/b_123/final-leaderboard",
        method: "GET",
      });
    });
  });
});
