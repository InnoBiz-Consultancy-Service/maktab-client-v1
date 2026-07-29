import { render, screen, waitFor } from "@testing-library/react";
import { ParentHomeView } from "../ParentHomeView";
import { getLeaderboardAction } from "@/actions/dashboard/leaderboard";

jest.mock("@/actions/dashboard/leaderboard", () => ({
  getLeaderboardAction: jest.fn(),
  getFinalLeaderboardAction: jest.fn(),
}));

const mockGetLeaderboardAction = getLeaderboardAction as jest.MockedFunction<
  typeof getLeaderboardAction
>;

describe("ParentHomeView Component", () => {
  const mockChildrenData = [
    {
      id: "c1",
      name: "Omar Farooq",
      batch: { id: "b1", name: "Tajweed Batch 1" },
      totalPoints: 120,
      rank: 2,
      attendanceRate: 92,
      recentAttendance: [],
      recentHomeworks: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLeaderboardAction.mockResolvedValue({
      ok: true,
      data: {
        scope: "batch",
        period: "alltime",
        totalStudents: 1,
        entries: [
          {
            rank: 1,
            studentId: "c1",
            name: "Omar Farooq",
            points: 120,
            attendanceRate: 92,
            quizzesCompleted: 3,
            homeworkCompleted: 5,
            badgeCount: 1,
            avatarUrl: null,
          },
        ],
        currentUserStanding: null,
      } as any,
    });
  });

  it("renders parent children overview list", async () => {
    render(<ParentHomeView childrenData={mockChildrenData as any} />);

    expect(screen.getByText("Omar Farooq")).toBeInTheDocument();
    expect(screen.getAllByText("Tajweed Batch 1")[0]).toBeInTheDocument();
  });

  it("handles empty children data gracefully", () => {
    render(<ParentHomeView childrenData={[]} />);

    expect(
      screen.getByText("No children are currently linked to your parent account."),
    ).toBeInTheDocument();
  });
});
