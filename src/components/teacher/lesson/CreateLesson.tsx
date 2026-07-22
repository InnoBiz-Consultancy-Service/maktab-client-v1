"use client";

import { createLessonAction } from "@/actions/teacher/lession/lesson.action";
import { Button, Card, Input, Select } from "@/components/ui";
import { Textarea } from "@/components/ui/Textarea";
import { Batch } from "@/types/institute/batch";
import { useState } from "react";

const CreateLesson = ({ batch }: { batch: Batch[] }) => {
  const [formData, setFormData] = useState({
    batchId: "",
    title: "",
    description: "",
    videoUrl: "",
    date: "",
    isPublished: true,
  });

  console.log("batch from ", batch);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "isPublished" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    await createLessonAction(formData);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-night-900">Add a lesson</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Batch */}
        <div>
          <Select
            label="Batch"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
          >
            <option value="">Select Batch</option>

            {batch.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Title */}
        <div>
          <Input
            label="Lesson Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Video URL */}
        <div>
          <Input
            label="Video URL"
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://youtu.be/..."
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date */}
        <div>
          <Input
            label="Lesson Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Publish */}
        <div>
          <Select
            label="Publish Status"
            name="isPublished"
            value={String(formData.isPublished)}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </Select>
        </div>

        {/* Description */}
        <div>
          <Textarea
            label="Description"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Lesson description"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Create Lesson
        </Button>
      </form>
    </Card>
  );
};

export default CreateLesson;
