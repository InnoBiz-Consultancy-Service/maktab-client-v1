// import { universalApi } from "@/actions/universal-api";

// export async function getLessonById(id: string) {
//   return universalApi({
//     endpoint: `/lessons/${id}`,
//     method: "GET",
//     requireAuth: true,
//   });
// }

export async function getLessonById(id: string) {
  const res = await fetch(`http://localhost:5000/lessons/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch lesson");
  }

  return await res.json();
}