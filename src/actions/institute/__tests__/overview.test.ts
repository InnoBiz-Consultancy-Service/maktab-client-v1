import { searchTeachersAction } from "@/actions/institute/teacher/get-teacher";
import { searchParentsAction } from "@/actions/institute/parent/get-parents";
import { getInstituteOverviewAction } from "@/actions/institute/overview";
import type { TeacherSearchResult } from "@/types/institute/teachers";
import type { ParentSearchResult } from "@/types/institute/parents";

jest.mock("@/actions/institute/teacher/get-teacher");
jest.mock("@/actions/institute/parent/get-parents");

const mockedSearchTeachers = searchTeachersAction as jest.Mock;
const mockedSearchParents = searchParentsAction as jest.Mock;

function teacher(id: string, createdAt: string): TeacherSearchResult {
  return {
    id,
    name: `Teacher ${id}`,
    gender: "MALE",
    education: "BA",
    phone: "01700000000",
    address: "Dhaka",
    createdAt,
    user: { email: `${id}@test.com` },
  };
}

function parent(
  id: string,
  name: string,
  children: ParentSearchResult["children"],
): ParentSearchResult {
  return {
    id,
    name,
    phone: "01700000000",
    relation: "Father",
    createdAt: "2026-01-01",
    user: { email: `${id}@test.com` },
    children,
  };
}

describe("getInstituteOverviewAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("propagates a teachers-fetch failure without calling parents' data", async () => {
    mockedSearchTeachers.mockResolvedValue({ ok: false, error: "Boom" });
    mockedSearchParents.mockResolvedValue({ ok: true, data: [] });

    const result = await getInstituteOverviewAction();

    expect(result).toEqual({ ok: false, error: "Boom" });
  });

  it("propagates a parents-fetch failure", async () => {
    mockedSearchTeachers.mockResolvedValue({ ok: true, data: [] });
    mockedSearchParents.mockResolvedValue({ ok: false, error: "Boom" });

    const result = await getInstituteOverviewAction();

    expect(result).toEqual({ ok: false, error: "Boom" });
  });

  it("flattens parents' children into students and computes counts", async () => {
    mockedSearchTeachers.mockResolvedValue({ ok: true, data: [] });
    mockedSearchParents.mockResolvedValue({
      ok: true,
      data: [
        parent("p1", "Rahim", [
          { id: "c1", name: "Abdullah", class: "Nursery", studentCode: "104829", isActive: true },
        ]),
        parent("p2", "Karim", [
          { id: "c2", name: "Yusuf", class: "Class 1", studentCode: "104830", isActive: true },
          { id: "c3", name: "Zainab", class: "Class 2", studentCode: "104831", isActive: false },
        ]),
      ],
    });

    const result = await getInstituteOverviewAction();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.counts).toEqual({ teachers: 0, students: 3, parents: 2 });
    expect(result.data.recentStudents).toEqual([
      { id: "c1", name: "Abdullah", class: "Nursery", studentCode: "104829", isActive: true, parentName: "Rahim" },
      { id: "c2", name: "Yusuf", class: "Class 1", studentCode: "104830", isActive: true, parentName: "Karim" },
      { id: "c3", name: "Zainab", class: "Class 2", studentCode: "104831", isActive: false, parentName: "Karim" },
    ]);
  });

  it("sorts recentTeachers newest-first and caps at 5", async () => {
    const teachers = [
      teacher("t1", "2026-01-01"),
      teacher("t2", "2026-03-01"),
      teacher("t3", "2026-02-01"),
      teacher("t4", "2026-05-01"),
      teacher("t5", "2026-04-01"),
      teacher("t6", "2026-06-01"),
    ];
    mockedSearchTeachers.mockResolvedValue({ ok: true, data: teachers });
    mockedSearchParents.mockResolvedValue({ ok: true, data: [] });

    const result = await getInstituteOverviewAction();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.recentTeachers.map((t) => t.id)).toEqual([
      "t6",
      "t4",
      "t5",
      "t2",
      "t3",
    ]);
    expect(result.data.counts.teachers).toBe(6);
  });

  it("caps recentStudents at 5 even when there are more", async () => {
    const children = Array.from({ length: 7 }, (_, i) => ({
      id: `c${i}`,
      name: `Student ${i}`,
      class: "Class 1",
      studentCode: `${i}`,
      isActive: true,
    }));
    mockedSearchTeachers.mockResolvedValue({ ok: true, data: [] });
    mockedSearchParents.mockResolvedValue({
      ok: true,
      data: [parent("p1", "Rahim", children)],
    });

    const result = await getInstituteOverviewAction();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.counts.students).toBe(7);
    expect(result.data.recentStudents).toHaveLength(5);
  });
});
