import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "@/components/ui/Select";

describe("Select", () => {
  it("associates the label with the field", () => {
    render(
      <Select label="Gender" name="gender">
        <option value="">Select…</option>
        <option value="MALE">Male</option>
      </Select>,
    );
    expect(screen.getByLabelText("Gender")).toBeInTheDocument();
  });

  it("shows an error message and marks the field invalid", () => {
    render(
      <Select label="Gender" name="gender" error="Select a gender">
        <option value="">Select…</option>
      </Select>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Select a gender");
    expect(screen.getByLabelText("Gender")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("lets the user choose an option", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Gender" name="gender">
        <option value="">Select…</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </Select>,
    );
    const select = screen.getByLabelText("Gender") as HTMLSelectElement;
    await user.selectOptions(select, "FEMALE");
    expect(select.value).toBe("FEMALE");
  });
});
