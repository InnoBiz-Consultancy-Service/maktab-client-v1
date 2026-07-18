import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Batch details</Card>);
    expect(screen.getByText("Batch details")).toBeInTheDocument();
  });

  it("does not apply hover-lift classes by default", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).not.toHaveClass("hover:shadow-lift");
  });

  it("applies hover-lift classes when interactive", () => {
    render(
      <Card data-testid="card" interactive>
        Content
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("hover:shadow-lift");
  });

  it("merges a custom className with the defaults", () => {
    render(
      <Card data-testid="card" className="max-w-2xl">
        Content
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("max-w-2xl");
    expect(card).toHaveClass("rounded-lg");
  });
});
