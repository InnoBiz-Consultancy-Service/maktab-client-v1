import {
  getTeacherDashboardOverviewAction,
  getTeacherDashboardStudentsAction,
  getTeacherStudentDetailAction,
} from "../teacher-dashboard";
import { universalApi } from "@/actions/universal-api";

jest.mock("@/actions/universal-api", () => ({
  universalApi: jest.fn(),
}));

const mockUniversalApi = universalApi as jest.MockedFunction<typeof universalApi>;

describe("Teacher Dashboard Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches teacher dashboard overview", async () => {
    const mockOverview = {
      totalBatches: 3,
      totalStudents: 45,
      activeHomeworks: 2,
    };

    mockUniversalApi.mockResolvedValueOnce({
      success: true,
      data: { data: mockOverview },
    });

    const result = await getTeacherDashboardOverviewAction();

    expect(result).toEqual({ ok: true, data: mockOverview });
    expect(mockUniversalApi).toHaveBeenCalledWith({
      endpoint: "/teachers/dashboard/overview",
      method: "GET",
    });
  });

  it("fetches teacher dashboard students with query params", async () => {
    const mockData = { items: [], total: 0, page: 1, limit: 10 };
    mockUniversalApi.mockResolvedValueOnce({
      success: true,
      data: mockData,
    });

    const result = await getTeacherDashboardStudentsAction({
      page: 1,
      limit: 10,
      search: "Ahmad",
    });

    expect(result).toEqual({ ok: true, data: mockData });
    expect(mockUniversalApi).toHaveBeenCalledWith({
      endpoint: "/teachers/dashboard/students?page=1&limit=10&search=Ahmad",
      method: "GET",
    });
  });

  it("fetches student detail for teacher", async () => {
    const mockDetail = { id: "st-1", name: "Student 1" };
    mockUniversalApi.mockResolvedValueOnce({
      success: true,
      data: mockDetail,
    });

    const result = await getTeacherStudentDetailAction("st-1");

    expect(result).toEqual({ ok: true, data: mockDetail });
    expect(mockUniversalApi).toHaveBeenCalledWith({
      endpoint: "/teachers/dashboard/students/st-1",
      method: "GET",
    });
  });
});
