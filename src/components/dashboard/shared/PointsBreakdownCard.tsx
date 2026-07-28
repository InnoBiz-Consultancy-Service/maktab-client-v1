"use client";

import { Award, BookOpen, FileCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui";
import type { PointsBreakdown } from "@/types/dashboard";

interface PointsBreakdownCardProps {
  points: number;
  breakdown: PointsBreakdown;
  title?: string;
}

export function PointsBreakdownCard({
  points,
  breakdown,
  title = "Scoring Breakdown",
}: PointsBreakdownCardProps) {
  const items = [
    {
      label: "Lesson Points",
      value: breakdown?.lessonPoints ?? 0,
      icon: BookOpen,
      color: "text-gold-600 bg-gold-500/10",
    },
    {
      label: "Homework Points",
      value: breakdown?.homeworkPoints ?? 0,
      icon: FileCheck,
      color: "text-arabic bg-arabic-soft",
    },
    {
      label: "Attendance Points",
      value: breakdown?.attendancePoints ?? 0,
      icon: CheckCircle2,
      color: "text-quran bg-quran-soft",
    },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-night-900">
            {title}
          </h2>
          <p className="text-xs text-ink-soft">
            Points earned from completed activities
          </p>
        </div>
        <div className="text-gold-700 flex items-center gap-2 rounded-full bg-gold-500/15 px-3 py-1.5">
          <Award className="h-4 w-4" />
          <span className="font-display font-bold text-night-900">
            {points} Total Points
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-cream-200 bg-cream-50 p-3.5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ink-soft">{item.label}</p>
                <p className="text-lg font-bold text-night-900">
                  {item.value} pts
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
