import {
  getTeacherHomeworks,
  getStudentHomeworks,
  submitStudentHomework,
  gradeSubmission,
} from "../homework";
import { universalApi } from "@/actions/universal-api";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/actions/universal-api", () => ({
  universalApi: jest.fn(),
}));

const mockUniversalApi = universalApi as jest.MockedFunction<typeof universalApi>;

describe("Homework Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTeacherHomeworks", () => {
    it("fetches teacher homework list successfully", async () => {
      const mockHomeworks = [
        { id: "hw1", title: "Surah Al-Fatiha Recitation", totalPoints: 100 },
      ];

      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { data: mockHomeworks },
      });

      const result = await getTeacherHomeworks();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(mockHomeworks);
      }
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/homeworks/teacher",
        method: "GET",
      });
    });

    it("applies query parameters when filters are passed", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { data: [] },
      });

      await getTeacherHomeworks({ search: "Quran", status: "ACTIVE" });

      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/homeworks/teacher?search=Quran&status=ACTIVE",
        method: "GET",
      });
    });
  });

  describe("getStudentHomeworks", () => {
    it("fetches student homework assignments", async () => {
      const mockStudentList = [
        { id: "hw2", title: "Tajweed Practice", chip: "NOT_SUBMITTED" },
      ];

      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { data: mockStudentList },
      });

      const result = await getStudentHomeworks();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(mockStudentList);
      }
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/homeworks/student",
        method: "GET",
      });
    });
  });

  describe("submitStudentHomework", () => {
    it("submits homework for a student", async () => {
      const submissionData = {
        homeworkId: "hw1",
        note: "Here is my recitation audio link",
        attachments: [
          { type: "LINK" as const, url: "https://example.com/audio.mp3", fileName: "Audio" },
        ],
      };

      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { submissionId: "sub1", status: "SUBMITTED" },
      });

      const result = await submitStudentHomework("hw1", submissionData);

      expect(result.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/homeworks/student/hw1/submit",
        method: "POST",
        data: submissionData,
      });
    });

    it("returns error on failure", async () => {
      mockUniversalApi.mockResolvedValueOnce({
        success: false,
        message: "Submission deadline passed",
      });

      const result = await submitStudentHomework("hw1", {
        note: "Late note",
        attachments: [],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Submission deadline passed");
      }
    });
  });

  describe("gradeSubmission", () => {
    it("grades student homework submission successfully", async () => {
      const gradePayload = {
        score: 95,
        feedback: "Excellent recitation and tajweed rules applied.",
      };

      mockUniversalApi.mockResolvedValueOnce({
        success: true,
        data: { id: "sub1", score: 95, status: "GRADED" },
      });

      const result = await gradeSubmission("sub1", gradePayload);

      expect(result.ok).toBe(true);
      expect(mockUniversalApi).toHaveBeenCalledWith({
        endpoint: "/homeworks/teacher/submissions/sub1/grade",
        method: "PATCH",
        data: gradePayload,
      });
    });
  });
});
