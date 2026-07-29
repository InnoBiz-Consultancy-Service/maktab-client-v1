import { render, screen } from "@testing-library/react";
import { StudentDashboard } from "../StudentDashboard";

describe("StudentDashboard Component", () => {
  const mockOverview = {
    profile: {
      id: "s1",
      name: "Yusuf Ali",
      avatarUrl: null,
      xp: 1500,
      todayDone: 2,
      dailyGoal: 3,
    },
    rank: {
      current: { id: "r1", title: "Talib", icon: "book" },
      next: { id: "r2", title: "Hafiz", minXp: 2000, icon: "crown" },
      progress: 75,
    },
    badges: [],
    nextLesson: null,
    counts: {
      completedLessons: 12,
      totalLessons: 20,
      attendanceRate: 95,
    },
  };

  it("renders student greeting and XP overview", () => {
    render(<StudentDashboard overview={mockOverview as any} />);

    expect(screen.getByText("Assalamu alaikum")).toBeInTheDocument();
    expect(screen.getByText("Yusuf Ali")).toBeInTheDocument();
    expect(screen.getByText("Talib")).toBeInTheDocument();
  });

  it("renders leaderboard section link", () => {
    render(<StudentDashboard overview={mockOverview as any} />);

    expect(screen.getByText(/View Leaderboard/i)).toBeInTheDocument();
  });
});
