import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FinalizeBar } from "@/components/teacher/Attendance/FinalizeBar";

describe("FinalizeBar", () => {
  it("fires onSave and onFinalize when their buttons are pressed", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    const onFinalize = jest.fn();
    render(
      <FinalizeBar saving={false} onSave={onSave} onFinalize={onFinalize} />,
    );

    await user.click(screen.getByRole("button", { name: "Save draft" }));
    await user.click(screen.getByRole("button", { name: "Finalize" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onFinalize).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons while saving", () => {
    render(
      <FinalizeBar saving={true} onSave={jest.fn()} onFinalize={jest.fn()} />,
    );
    expect(screen.getByRole("button", { name: /save draft/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /finalize/i })).toBeDisabled();
  });

  it("disables both buttons when explicitly disabled", () => {
    render(
      <FinalizeBar
        saving={false}
        onSave={jest.fn()}
        onFinalize={jest.fn()}
        disabled
      />,
    );
    expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Finalize" })).toBeDisabled();
  });
});
