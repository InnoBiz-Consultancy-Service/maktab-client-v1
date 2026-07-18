import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DarkInput } from "@/components/ui/DarkInput";

describe("DarkInput", () => {
  it("associates the label with the field", () => {
    render(<DarkInput label="Student code" name="studentCode" />);
    expect(screen.getByLabelText("Student code")).toBeInTheDocument();
  });

  it("marks the field invalid and wires aria-describedby when an error is set", () => {
    render(
      <DarkInput
        label="Password"
        name="password"
        error="Password is required"
      />,
    );
    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAttribute("aria-describedby", "password-error");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<DarkInput label="Student code" name="studentCode" />);
    const field = screen.getByLabelText("Student code");
    await user.type(field, "STU-1029");
    expect(field).toHaveValue("STU-1029");
  });
});
