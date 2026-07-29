import { render, screen } from "@testing-library/react";
import { StudentSubmissionForm } from "../StudentSubmissionForm";
import { submitStudentHomework } from "@/actions/homework";

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
  submitStudentHomework: jest.fn(),
}));

describe("StudentSubmissionForm Component", () => {
  const mockHomework = {
    id: "hw-1",
    title: "Surah Al-Mulk Memorization",
    description: "Recite verses 1-10 with proper tajweed",
    instruction: "Recite verses 1-10 with proper tajweed",
    totalPoints: 100,
    maxScore: 100,
    dueDate: "2026-12-31",
    createdAt: "2026-01-01",
    status: "ACTIVE" as const,
    lesson: null,
    teacher: { id: "t1", name: "Ustadh Ahmad" },
    batch: { id: "b1", name: "Hifz Batch A" },
    batches: [{ id: "b1", name: "Hifz Batch A" }],
    attachments: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders homework title and details", () => {
    render(
      <StudentSubmissionForm
        homework={mockHomework as any}
        canSubmit={true}
        submission={null}
      />,
    );

    expect(screen.getByText("Surah Al-Mulk Memorization")).toBeInTheDocument();
    expect(screen.getByText(/Recite verses 1-10/)).toBeInTheDocument();
  });

  it("shows blocked message when submission is not allowed", () => {
    render(
      <StudentSubmissionForm
        homework={mockHomework as any}
        canSubmit={false}
        submission={null}
        submitBlockedReason="Submission period has closed."
      />,
    );

    expect(
      screen.getByText("Submission period has closed."),
    ).toBeInTheDocument();
  });

  it("displays existing submission and grade if graded", () => {
    const mockSubmission = {
      id: "sub-1",
      homeworkId: "hw-1",
      studentId: "st-1",
      submittedAt: "2026-01-02T10:00:00Z",
      status: "GRADED" as const,
      isLate: false,
      note: "Memorization completed",
      attachments: [],
      score: 95,
      feedback: "MashaAllah, great pronunciation!",
      gradedAt: "2026-01-03T12:00:00Z",
    };

    render(
      <StudentSubmissionForm
        homework={mockHomework as any}
        canSubmit={false}
        submission={mockSubmission as any}
      />,
    );

    expect(screen.getByText("95")).toBeInTheDocument();
    expect(
      screen.getByText("MashaAllah, great pronunciation!"),
    ).toBeInTheDocument();
  });
});
