import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateHomeworkForm } from "../CreateHomeworkForm";
import { createHomework } from "@/actions/homework";

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
  createHomework: jest.fn(),
  getBatchStudents: jest.fn().mockResolvedValue({ ok: true, data: [] }),
}));

describe("CreateHomeworkForm Component", () => {
  const mockBatches = [{ id: "b1", name: "Batch Alpha" }];
  const mockLessons = [
    { id: "l1", title: "Lesson 1: Tajweed Basics", youtubeVideoId: "abc1234" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders homework creation fields", () => {
    render(
      <CreateHomeworkForm batches={mockBatches} lessons={mockLessons} />,
    );

    expect(screen.getByText("Create New Homework")).toBeInTheDocument();
    expect(screen.getByText("Homework Title *")).toBeInTheDocument();
    expect(screen.getByText("Batch *")).toBeInTheDocument();
  });

  it("validates required fields before submission", async () => {
    const { container } = render(
      <CreateHomeworkForm batches={mockBatches} lessons={mockLessons} />,
    );

    // Select batch to reveal the rest of the form and submit button
    const selects = container.querySelectorAll("select");
    const batchSelect = selects[0];
    fireEvent.change(batchSelect, { target: { value: "b1" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Save Assignment/i })).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /Save Assignment/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Title cannot be empty")).toBeInTheDocument();
    });
  });
});
