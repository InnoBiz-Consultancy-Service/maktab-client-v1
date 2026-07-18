import { render } from "@testing-library/react";
import { Skeleton } from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders a shimmering placeholder hidden from assistive tech", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden");
    expect(el).toHaveClass("animate-shimmer");
    expect(el).toHaveClass("h-4");
    expect(el).toHaveClass("w-24");
  });
});
