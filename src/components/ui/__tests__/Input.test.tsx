import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("associates the label with the field", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows an error message and marks the field invalid", () => {
    render(<Input label="Email" name="email" error="Enter a valid email" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" name="name" />);
    const field = screen.getByLabelText("Name");
    await user.type(field, "Arif");
    expect(field).toHaveValue("Arif");
  });
});
