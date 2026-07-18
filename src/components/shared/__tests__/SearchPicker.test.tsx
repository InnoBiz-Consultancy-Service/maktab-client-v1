import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchPicker, type PickerItem } from "@/components/shared/SearchPicker";

const items: PickerItem[] = [
  { id: "1", title: "Rahim Uddin", subtitle: "rahim@example.com" },
];

describe("SearchPicker", () => {
  it("debounces typing and calls onSearch once results settle", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn().mockResolvedValue(items);
    render(
      <SearchPicker
        label="Teacher"
        placeholder="Search teachers…"
        onSearch={onSearch}
        selected={null}
        onSelect={jest.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Teacher"), "Rahim");

    await waitFor(() => {
      expect(screen.getByText("Rahim Uddin")).toBeInTheDocument();
    });
    expect(onSearch).toHaveBeenCalledWith("Rahim");
  });

  it("selects a result and calls onSelect with it", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn().mockResolvedValue(items);
    const onSelect = jest.fn();
    render(
      <SearchPicker
        label="Teacher"
        placeholder="Search teachers…"
        onSearch={onSearch}
        selected={null}
        onSelect={onSelect}
      />,
    );

    await user.type(screen.getByLabelText("Teacher"), "Rahim");
    await waitFor(() => screen.getByText("Rahim Uddin"));
    await user.click(screen.getByText("Rahim Uddin"));

    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it("shows the selected item as a chip and clears it on remove", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(
      <SearchPicker
        label="Teacher"
        placeholder="Search teachers…"
        onSearch={jest.fn().mockResolvedValue([])}
        selected={items[0]}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Rahim Uddin")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Change teacher"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("shows the empty-state action when a search returns nothing", async () => {
    const user = userEvent.setup();
    render(
      <SearchPicker
        label="Parent"
        placeholder="Search parents…"
        onSearch={jest.fn().mockResolvedValue([])}
        selected={null}
        onSelect={jest.fn()}
        emptyAction={<button type="button">Add a new parent</button>}
      />,
    );

    await user.type(screen.getByLabelText("Parent"), "Nobody");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add a new parent" }),
      ).toBeInTheDocument();
    });
  });
});
