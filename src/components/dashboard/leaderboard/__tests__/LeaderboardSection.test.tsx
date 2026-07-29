import { render, screen, waitFor } from "@testing-library/react";
import { LeaderboardSection } from "../LeaderboardSection";
import {
  getLeaderboardAction,
  getFinalLeaderboardAction,
} from "@/actions/dashboard/leaderboard";

jest.mock("@/actions/dashboard/leaderboard", () => ({
  getLeaderboardAction: jest.fn(),
  getFinalLeaderboardAction: jest.fn(),
}));

const mockGetLeaderboardAction = getLeaderboardAction as jest.MockedFunction<
  typeof getLeaderboardAction
>;
const mockGetFinalLeaderboardAction = getFinalLeaderboardAction as jest.MockedFunction<
  typeof getFinalLeaderboardAction
>;

describe("LeaderboardSection Component", () => {
  const mockBatches = [
    { id: "b1", name: "Batch 1" },
    { id: "b2", name: "Batch 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders live standings when batch is selected", async () => {
    mockGetLeaderboardAction.mockResolvedValue({
      ok: true,
      data: {
        scope: "batch",
        period: "alltime",
        totalStudents: 1,
        entries: [
          {
            rank: 1,
            studentId: "s1",
            name: "Student Leader",
            points: 300,
            attendanceRate: 100,
            quizzesCompleted: 5,
            homeworkCompleted: 5,
            badgeCount: 2,
            avatarUrl: null,
          },
        ],
        currentUserStanding: null,
      } as any,
    });

    render(
      <LeaderboardSection
        batches={mockBatches}
        defaultBatchId="b1"
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText("Student Leader")[0]).toBeInTheDocument();
      expect(screen.getAllByText(/300/)[0]).toBeInTheDocument();
    });
  });

  it("shows error when batch is not selected or empty", async () => {
    render(<LeaderboardSection batches={[]} defaultBatchId="" />);

    await waitFor(() => {
      expect(
        screen.getByText("No batch assigned or selected."),
      ).toBeInTheDocument();
    });
  });
});
