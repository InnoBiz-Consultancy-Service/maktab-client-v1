import {
  getParentChildrenDashboardAction,
  getParentChildDetailDashboardAction,
} from "../parent-dashboard";
import { universalApi } from "@/actions/universal-api";

jest.mock("@/actions/universal-api", () => ({
  universalApi: jest.fn(),
}));

const mockUniversalApi = universalApi as jest.MockedFunction<typeof universalApi>;

describe("Parent Dashboard Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches children overview list", async () => {
    const mockChildren = [
      { id: "c1", name: "Child One", batchName: "Batch A" },
    ];

    mockUniversalApi.mockResolvedValueOnce({
      success: true,
      data: { data: mockChildren },
    });

    const result = await getParentChildrenDashboardAction();

    expect(result).toEqual({ ok: true, data: mockChildren });
    expect(mockUniversalApi).toHaveBeenCalledWith({
      endpoint: "/parents/dashboard/children",
      method: "GET",
    });
  });

  it("fetches child details for parent", async () => {
    const mockChildDetail = { id: "c1", name: "Child One", attendanceRate: 98 };

    mockUniversalApi.mockResolvedValueOnce({
      success: true,
      data: mockChildDetail,
    });

    const result = await getParentChildDetailDashboardAction("c1");

    expect(result).toEqual({ ok: true, data: mockChildDetail });
    expect(mockUniversalApi).toHaveBeenCalledWith({
      endpoint: "/parents/dashboard/children/c1",
      method: "GET",
    });
  });
});
