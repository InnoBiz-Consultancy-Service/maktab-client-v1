import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/ui/Spinner";

describe("Spinner", () => {
  it("renders an accessible loading indicator", () => {
    render(<Spinner />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("spins with the animate-spin class", () => {
    render(<Spinner />);
    expect(screen.getByLabelText("Loading")).toHaveClass("animate-spin");
  });

  it("merges a custom className with the defaults", () => {
    render(<Spinner className="h-8 w-8" />);
    const spinner = screen.getByLabelText("Loading");
    expect(spinner).toHaveClass("h-8");
    expect(spinner).toHaveClass("animate-spin");
  });
});
