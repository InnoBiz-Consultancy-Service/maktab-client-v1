"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type {
  ComplaintStatus,
  ReportedRole,
  ComplaintSortBy,
  SortOrder,
} from "@/types/shared/complaint";

export interface ComplaintFilters {
  search: string;
  status: ComplaintStatus | "ALL";
  reportedRole: ReportedRole | "ALL";
  fromDate: string;
  toDate: string;
  sortBy: ComplaintSortBy;
  sortOrder: SortOrder;
}

const DEFAULT_FILTERS: ComplaintFilters = {
  search: "",
  status: "ALL",
  reportedRole: "ALL",
  fromDate: "",
  toDate: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

interface ComplaintFilterBarProps {
  filters: ComplaintFilters;
  onChange: (filters: ComplaintFilters) => void;
  /** If true, shows the Reported Role filter (used by Institute & Admin views). */
  showRoleFilter?: boolean;
}

export function ComplaintFilterBar({
  filters,
  onChange,
  showRoleFilter = true,
}: ComplaintFilterBarProps) {
  const update = <K extends keyof ComplaintFilters>(
    key: K,
    value: ComplaintFilters[K],
  ) => onChange({ ...filters, [key]: value });

  const isDirty = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="flex flex-col gap-3">
      {/* Search + Status row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            id="complaint-search"
            placeholder="Search complaints…"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <Select
          id="complaint-status-filter"
          label=""
          value={filters.status}
          onChange={(e) =>
            update("status", e.target.value as ComplaintFilters["status"])
          }
          className="sm:w-40"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
        </Select>

        {showRoleFilter && (
          <Select
            id="complaint-role-filter"
            label=""
            value={filters.reportedRole}
            onChange={(e) =>
              update(
                "reportedRole",
                e.target.value as ComplaintFilters["reportedRole"],
              )
            }
            className="sm:w-40"
          >
            <option value="ALL">All roles</option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
            <option value="PARENT">Parent</option>
          </Select>
        )}
      </div>

      {/* Date range + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            id="complaint-from-date"
            label="From"
            type="date"
            value={filters.fromDate}
            onChange={(e) => update("fromDate", e.target.value)}
          />
          <Input
            id="complaint-to-date"
            label="To"
            type="date"
            value={filters.toDate}
            onChange={(e) => update("toDate", e.target.value)}
          />
        </div>

        <Select
          id="complaint-sort-by"
          label="Sort"
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            onChange({
              ...filters,
              sortBy: sortBy as ComplaintSortBy,
              sortOrder: sortOrder as SortOrder,
            });
          }}
          className="sm:w-48"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="updatedAt:desc">Recently updated</option>
          <option value="status:asc">Status (Pending first)</option>
          <option value="status:desc">Status (Resolved first)</option>
        </Select>

        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_FILTERS };
