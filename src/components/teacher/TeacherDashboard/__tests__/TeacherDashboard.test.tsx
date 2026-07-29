import { render, screen } from "@testing-library/react";
import { TeacherDashboard } from "../TeacherDashboard";

describe("TeacherDashboard Component", () => {
  const mockOverview = {
    counts: {
      students: 35,
      attendancePending: 1,
      todayTotal: 2,
      todayMarked: 1,
    },
    todayBatches: [
      {
        id: "b1",
        batch: { id: "b1", name: "Hifz Class A" },
        time: "09:00 AM",
        status: "PENDING" as const,
        totalStudents: 15,
      },
    ],
    recentMarks: [],
    exams: [],
  };

  it("renders teacher welcome header and stats", () => {
    render(<TeacherDashboard name="Ustadh Bilal" overview={mockOverview as any} />);

    expect(screen.getByText("Assalamu alaikum, Ustadh Bilal.")).toBeInTheDocument();
    expect(screen.getByText("My students")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
  });

  it("displays today's batches", () => {
    render(<TeacherDashboard name="Ustadh Bilal" overview={mockOverview as any} />);

    expect(screen.getByText("Hifz Class A")).toBeInTheDocument();
  });
});
