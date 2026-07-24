"use client";

import { useState } from "react";
import { ParentHomeworkData } from "@/actions/homework";
import { Card, Button } from "@/components/ui";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { Calendar, Award, User, BookOpen, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface ParentHomeworkViewProps {
  data: ParentHomeworkData;
}

export function ParentHomeworkView({ data }: ParentHomeworkViewProps) {
  const { children, results } = data;

  // Active child state
  const [selectedChildId, setSelectedChildId] = useState(
    children.length > 0 ? children[0].id : ""
  );

  // Accordion state to show teacher feedback
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

  const toggleFeedback = (id: string) => {
    setExpandedFeedbackId((prev) => (prev === id ? null : id));
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Filter homework results for selected child
  const childResults = results.filter((r) => r.student.id === selectedChildId);

  const showSwitcher = children.length > 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">Children's Homework</h1>
          <p className="text-sm text-ink-soft">Track assignments, grades, and teacher feedback for your children.</p>
        </div>

        {/* Child Switcher (Visible only if children.length > 1) */}
        {showSwitcher && (
          <div className="flex bg-cream-200/50 p-1.5 rounded-full border border-cream-200 w-fit">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  setSelectedChildId(child.id);
                  setExpandedFeedbackId(null);
                }}
                className={`px-5 py-2 text-xs font-bold font-display rounded-full transition-all flex items-center gap-1.5 ${
                  selectedChildId === child.id
                    ? "bg-gold-500 text-night-900 shadow-sm"
                    : "text-ink hover:text-gold-600"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>{child.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Child Summary Banner */}
      {selectedChild && (
        <div className="bg-night-900 text-cream-50 p-5 rounded-lg border border-night-800 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-night-800 p-2.5 rounded-full text-gold-500 border border-night-700">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-cream-100/60 uppercase tracking-wider font-semibold">Active Profile</p>
              <h2 className="text-lg font-bold">{selectedChild.name}</h2>
            </div>
          </div>
          <span className="text-xs font-semibold bg-night-800 border border-night-700 px-3 py-1 rounded text-cream-100">
            Student Code: {selectedChild.studentCode}
          </span>
        </div>
      )}

      {/* Homework List */}
      {childResults.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-ink-soft/40" />
          <h3 className="mt-4 text-lg font-bold text-night-900 font-display">No homework assigned</h3>
          <p className="mt-1 text-sm text-ink-soft">
            There are currently no active homework assignments for this child.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 max-w-4xl">
          {childResults.map((row) => {
            const hw = row.homework;
            const isGraded = row.status === "GRADED";
            const hasFeedback = isGraded && row.feedback;
            const isExpanded = expandedFeedbackId === row.assignmentId;

            return (
              <Card
                key={row.assignmentId}
                className="border border-cream-200 shadow-soft space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-quran bg-quran-soft px-2 py-0.5 rounded">
                      {hw.batch.name}
                    </span>
                    <StatusChip
                      status={row.status}
                      isLate={row.isLate}
                      dueDate={hw.dueDate}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {hw.dueDate}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-night-900">{hw.title}</h3>
                    <p className="text-sm text-ink-soft line-clamp-2 leading-relaxed">
                      {hw.instruction}
                    </p>
                    <p className="text-xs text-ink-soft/80">
                      Assigned by: <strong className="text-night-900/80">{hw.teacher.name}</strong>
                    </p>
                  </div>

                  {/* Score view */}
                  <div className="text-right shrink-0">
                    {isGraded ? (
                      <div>
                        <span className="text-xs text-ink-soft block uppercase tracking-wider font-semibold">Grade</span>
                        <span className="text-lg font-extrabold text-success">
                          {hw.maxScore !== null ? `${row.score} / ${hw.maxScore}` : "Complete"}
                        </span>
                      </div>
                    ) : row.status === "SUBMITTED" ? (
                      <span className="text-xs font-semibold text-warn bg-warn/10 px-2 py-1 rounded">Awaiting Grade</span>
                    ) : (
                      <span className="text-xs font-semibold text-ink-soft bg-cream-200/50 px-2 py-1 rounded">Pending Work</span>
                    )}
                  </div>
                </div>

                {/* Feedback accordion */}
                {hasFeedback && (
                  <div className="border-t border-cream-100 pt-3">
                    <button
                      onClick={() => toggleFeedback(row.assignmentId)}
                      className="flex items-center gap-1 text-xs font-bold text-quran hover:text-quran/80 transition-colors"
                    >
                      <span>{isExpanded ? "Hide Feedback" : "Show Teacher Feedback"}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 bg-cream-50 border border-cream-200 p-3 rounded-lg flex items-start gap-2.5 animate-float-half">
                        <MessageSquare className="h-4 w-4 text-quran shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-night-900">Teacher's Note</p>
                          <p className="text-xs text-ink-soft leading-relaxed whitespace-pre-wrap">
                            "{row.feedback}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
