import { render, screen } from "@testing-library/react";
import { StatusChip } from "../StatusChip";

describe("StatusChip Component", () => {
  it("renders NOT_SUBMITTED chip status correctly", () => {
    render(<StatusChip chip="NOT_SUBMITTED" />);
    expect(screen.getByText("Not submitted")).toBeInTheDocument();
  });

  it("renders OVERDUE status correctly", () => {
    render(<StatusChip chip="OVERDUE" />);
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("renders SUBMITTED status correctly", () => {
    render(<StatusChip chip="SUBMITTED" />);
    expect(screen.getByText("Submitted")).toBeInTheDocument();
  });

  it("renders SUBMITTED_LATE status correctly", () => {
    render(<StatusChip chip="SUBMITTED_LATE" />);
    expect(screen.getByText("Submitted late")).toBeInTheDocument();
  });

  it("renders GRADED status correctly", () => {
    render(<StatusChip chip="GRADED" />);
    expect(screen.getByText("Graded")).toBeInTheDocument();
  });

  it("renders GRADED_LATE status with late badge", () => {
    render(<StatusChip chip="GRADED_LATE" />);
    expect(screen.getByText("Graded")).toBeInTheDocument();
    expect(screen.getByText("Late")).toBeInTheDocument();
  });

  it("handles fallback status conversion correctly when chip is missing", () => {
    render(<StatusChip status="GRADED" isLate={true} />);
    expect(screen.getByText("Graded")).toBeInTheDocument();
    expect(screen.getByText("Late")).toBeInTheDocument();
  });
});
