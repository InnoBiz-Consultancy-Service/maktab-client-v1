import { unwrapList } from "@/lib/utils/unwrap";

describe("unwrapList", () => {
  it("returns a bare array unchanged", () => {
    expect(unwrapList<number>([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("unwraps a { data: [...] } envelope", () => {
    expect(unwrapList<number>({ data: [1, 2, 3] })).toEqual([1, 2, 3]);
  });

  it("returns an empty array when data is not an array", () => {
    expect(unwrapList({ data: "not an array" })).toEqual([]);
  });

  it("returns an empty array when there is no data property", () => {
    expect(unwrapList({ message: "ok" })).toEqual([]);
  });

  it("returns an empty array for null or primitive input", () => {
    expect(unwrapList(null)).toEqual([]);
    expect(unwrapList(undefined)).toEqual([]);
    expect(unwrapList("string")).toEqual([]);
    expect(unwrapList(42)).toEqual([]);
  });
});
