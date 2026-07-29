import {
  getLeaderboardAction,
  completeBatchAction,
  getFinalLeaderboardAction,
} from "../leaderboard";
import { universalApi } from "@/actions/universal-api";

jest.mock("@/actions/universal-api", () => ({
  universalApi: jest.fn(),
}));

const mockUniversalApi = universalApi as jest.MockedFunction<typeof universalApi>;

describe("Leaderboard Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLeaderboardAction", () => {
    it("should fetch leaderboard data successfully for institute scope", async () => {
      const mockData = {
        standings: [
          { rank: 1, studentId: "s1", studentName: "Student One", totalPoints: 100 },
        ],
        currentUserStanding: null,
      };

      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { data: mockData },
      });

      const result = await getLeaderboardAction({
        scope: "institute",
        period: "weekly",
      });

      expect(result).toEqual({ ok: true, data: mockData });
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/leaderboard?scope=institute&period=weekly",
        method: "GET",
      });
    });

    it("should include batchId when scope is batch and batchId is provided", async () => {
      const mockData = { standings: [] };
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: mockData,
      });

      const result = await getLeaderboardAction({
        scope: "batch",
        batchId: "batch-123",
        period: "alltime",
      });

      expect(result).toEqual({ ok: true, data: mockData });
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/leaderboard?scope=batch&batchId=batch-123&period=alltime",
        method: "GET",
      });
    });

    it("should fallback scope to institute if scope is batch but batchId is missing", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { standings: [] },
      });

      await getLeaderboardAction({
        scope: "batch",
        period: "monthly",
      });

      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/leaderboard?scope=institute&period=monthly",
        method: "GET",
      });
    });

    it("should return error when API request fails", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: false,
        message: "Failed to fetch leaderboard",
      });

      const result = await getLeaderboardAction({ scope: "institute" });

      expect(result).toEqual({
        ok: false,
        error: "Failed to fetch leaderboard",
      });
    });
  });

  describe("completeBatchAction", () => {
    it("should complete batch successfully", async () => {
      const mockResponse = { batchId: "b1", status: "COMPLETED" };
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: mockResponse,
      });

      const result = await completeBatchAction("b1");

      expect(result).toEqual({ ok: true, data: mockResponse });
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/batches/b1/complete",
        method: "PATCH",
      });
    });

    it("should handle error when completing batch fails", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: false,
        message: "Unauthorized",
      });

      const result = await completeBatchAction("b1");

      expect(result).toEqual({
        ok: false,
        error: "Unauthorized",
      });
    });
  });

  describe("getFinalLeaderboardAction", () => {
    it("should fetch final leaderboard data", async () => {
      const mockFinalData = { batchName: "Batch A", winners: [] };
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: mockFinalData,
      });

      const result = await getFinalLeaderboardAction("b1");

      expect(result).toEqual({ ok: true, data: mockFinalData });
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/batches/b1/final-leaderboard",
        method: "GET",
      });
    });
  });
});
