import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Sign in</Button>);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("uses the gold primary background by default", () => {
    render(<Button>Continue</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gold-500");
  });

  it("shows a spinner and disables while loading", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("fires onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Tap</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Tap</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
