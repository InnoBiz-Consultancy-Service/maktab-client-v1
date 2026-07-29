import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GradingForm } from "../GradingForm";
import { gradeSubmission } from "@/actions/homework";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/actions/homework", () => ({
  gradeSubmission: jest.fn(),
}));

describe("GradingForm Component", () => {
  const mockSubmission = {
    id: "sub-100",
    student: {
      id: "st-1",
      name: "Tariq Mahmood",
      email: "tariq@example.com",
      avatarUrl: null,
    },
    homework: {
      id: "hw-1",
      title: "Surah Al-Fatiha Recitation",
      description: "Recite clearly",
      maxScore: 100,
      dueDate: "2026-12-31",
    },
    status: "SUBMITTED" as const,
    submittedAt: "2026-01-15T12:00:00Z",
    isLate: false,
    note: "Submitted my recording",
    attachments: [],
    score: null,
    feedback: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders submission details and grading input", () => {
    render(
      <GradingForm submission={mockSubmission as any} homeworkId="hw-1" />,
    );

    expect(screen.getByText("Tariq Mahmood")).toBeInTheDocument();
    expect(screen.getByText("Submitted my recording")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter score")).toBeInTheDocument();
  });

  it("validates score exceed max score", async () => {
    const { container } = render(
      <GradingForm submission={mockSubmission as any} homeworkId="hw-1" />,
    );

    const scoreInput = screen.getByPlaceholderText("Enter score");
    fireEvent.change(scoreInput, { target: { value: "150" } });

    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText(/Score must be a number between 0 and 100/i),
      ).toBeInTheDocument();
    });
  });
});
