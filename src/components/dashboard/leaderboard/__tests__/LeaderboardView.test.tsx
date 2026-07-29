import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LeaderboardView } from "../LeaderboardView";
import { getLeaderboardAction } from "@/actions/dashboard/leaderboard";

jest.mock("@/actions/dashboard/leaderboard", () => ({
  getLeaderboardAction: jest.fn(),
  completeBatchAction: jest.fn(),
  getFinalLeaderboardAction: jest.fn(),
}));

const mockGetLeaderboardAction = getLeaderboardAction as jest.MockedFunction<
  typeof getLeaderboardAction
>;

describe("LeaderboardView Component", () => {
  const mockBatches = [
    { id: "b1", name: "Batch Alpha" },
    { id: "b2", name: "Batch Beta" },
  ];

  const mockStandingsData = {
    scope: "institute",
    period: "alltime",
    totalStudents: 3,
    entries: [
      {
        rank: 1,
        studentId: "s1",
        name: "Ahmad Ali",
        points: 250,
        attendanceRate: 98,
        quizzesCompleted: 10,
        homeworkCompleted: 15,
        badgeCount: 5,
        avatarUrl: null,
      },
      {
        rank: 2,
        studentId: "s2",
        name: "Fatima Zahra",
        points: 210,
        attendanceRate: 95,
        quizzesCompleted: 8,
        homeworkCompleted: 14,
        badgeCount: 4,
        avatarUrl: null,
      },
      {
        rank: 3,
        studentId: "s3",
        name: "Zaid Hasan",
        points: 180,
        attendanceRate: 90,
        quizzesCompleted: 7,
        homeworkCompleted: 12,
        badgeCount: 3,
        avatarUrl: null,
      },
    ],
    currentUserStanding: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLeaderboardAction.mockResolvedValue({
      ok: true,
      data: mockStandingsData as any,
    });
  });

  it("renders leaderboard title and filter buttons", async () => {
    render(
      <LeaderboardView
        batches={mockBatches}
        userRole="TEACHER"
        defaultBatchId="b1"
      />,
    );

    expect(screen.getByText(/Live Leaderboard/i)).toBeInTheDocument();
    expect(screen.getByText("alltime")).toBeInTheDocument();
    expect(screen.getByText("weekly")).toBeInTheDocument();
    expect(screen.getByText("monthly")).toBeInTheDocument();
  });

  it("displays top students correctly", async () => {
    render(
      <LeaderboardView
        initialData={mockStandingsData as any}
        batches={mockBatches}
        userRole="INSTITUTE"
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText("Ahmad Ali")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Fatima Zahra")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Zaid Hasan")[0]).toBeInTheDocument();
    });
  });

  it("handles period toggle change", async () => {
    render(
      <LeaderboardView
        batches={mockBatches}
        userRole="TEACHER"
        defaultBatchId="b1"
      />,
    );

    const weeklyButton = screen.getByText("weekly");
    fireEvent.click(weeklyButton);

    await waitFor(() => {
      expect(mockGetLeaderboardAction).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "weekly",
        }),
      );
    });
  });

  it("shows error state when fetching fails", async () => {
    mockGetLeaderboardAction.mockResolvedValueOnce({
      ok: false,
      error: "Server Error",
    });

    render(
      <LeaderboardView
        batches={mockBatches}
        userRole="TEACHER"
        defaultBatchId="b1"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Server Error")).toBeInTheDocument();
    });
  });
});
