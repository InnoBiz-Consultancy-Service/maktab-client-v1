"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Users,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  KeyRound,
} from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import {
  SearchPicker,
  type PickerItem,
} from "@/components/shared/SearchPicker";
import { newParentSchema } from "@/lib/utils/validation";
import { CreatedStudent } from "@/types/institute/student";
import { searchTeachersAction } from "@/actions/institute/teacher/get-teacher";
import { searchParentsAction } from "@/actions/institute/parent/get-parents";
import { createStudentAction } from "@/actions/institute/student/create-student";

type StepId = 0 | 1 | 2 | 3;

const steps = [
  { id: 0, label: "Student", icon: User },
  { id: 1, label: "Teacher", icon: GraduationCap },
  { id: 2, label: "Parent", icon: Users },
  { id: 3, label: "Review", icon: ClipboardCheck },
] as const;

interface StudentFields {
  name: string;
  class: string;
  dob: string;
  gender: string;
  allergies: string;
  photoConsent: boolean;
}

interface NewParentFields {
  name: string;
  email: string;
  phone: string;
  relation: string;
}

const emptyStudent: StudentFields = {
  name: "",
  class: "",
  dob: "",
  gender: "",
  allergies: "",
  photoConsent: false,
};
const emptyNewParent: NewParentFields = {
  name: "",
  email: "",
  phone: "",
  relation: "",
};

/** Small copy-to-clipboard button used for the codes on the success screen. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(`${label} copied`);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" aria-hidden />
      ) : (
        <Copy className="h-4 w-4" aria-hidden />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function CreateStudentWizard() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>(0);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedStudent | null>(null);

  // form state
  const [student, setStudent] = useState<StudentFields>(emptyStudent);
  const [teacher, setTeacher] = useState<PickerItem | null>(null);
  const [parent, setParent] = useState<PickerItem | null>(null);
  const [addingNewParent, setAddingNewParent] = useState(false);
  const [newParent, setNewParent] = useState<NewParentFields>(emptyNewParent);

  // per-step errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---- search adapters (stable identities for the picker's debounce) ----
  const searchTeachers = useCallback(
    async (term: string): Promise<PickerItem[]> => {
      const res = await searchTeachersAction(term);
      if (!res.ok) {
        toast.error(res.error);
        return [];
      }
      return res.data.map((t) => ({
        id: t.id,
        title: t.name,
        subtitle: [t.user?.email, t.phone].filter(Boolean).join(" · "),
      }));
    },
    [],
  );

  const searchParents = useCallback(
    async (term: string): Promise<PickerItem[]> => {
      const res = await searchParentsAction(term);
      if (!res.ok) {
        toast.error(res.error);
        return [];
      }
      return res.data.map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: [p.user?.email, p.phone, p.relation]
          .filter(Boolean)
          .join(" · "),
      }));
    },
    [],
  );

  // ---- per-step validation ----
  function validateStep(current: StepId): boolean {
    const e: Record<string, string> = {};

    if (current === 0) {
      if (student.name.trim().length < 2)
        e.name = "Name must be at least 2 characters";
      if (!student.class.trim()) e.class = "Enter a class";
      if (!student.dob) e.dob = "Enter the date of birth";
      else if (Number.isNaN(Date.parse(student.dob)))
        e.dob = "Enter a valid date";
      if (!student.gender) e.gender = "Select a gender";
      if (student.allergies.length > 255) e.allergies = "Too long (max 255)";
    }

    if (current === 1 && !teacher) {
      e.teacher = "Select a teacher for this student";
    }

    if (current === 2) {
      if (addingNewParent) {
        const parsed = newParentSchema.safeParse(newParent);
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            const key = issue.path[0];
            if (typeof key === "string" && !e[key]) e[key] = issue.message;
          }
        }
      } else if (!parent) {
        e.parent = "Select an existing parent, or add a new one";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1) as StepId);
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1) as StepId);
  }

  // ---- submit ----
  async function submit() {
    // re-validate everything before sending
    for (const s of [0, 1, 2] as StepId[]) {
      if (!validateStep(s)) {
        setStep(s);
        toast.error("Please fix the highlighted fields.");
        return;
      }
    }

    setSubmitting(true);
    const res = await createStudentAction({
      name: student.name.trim(),
      class: student.class.trim(),
      dob: student.dob,
      gender: student.gender,
      allergies: student.allergies.trim() || undefined,
      photoConsent: student.photoConsent,
      teacherId: teacher!.id,
      // exactly one of these
      ...(addingNewParent
        ? {
            parent: {
              ...newParent,
              name: newParent.name.trim(),
              email: newParent.email.trim(),
              phone: newParent.phone.trim(),
              relation: newParent.relation.trim(),
            },
          }
        : { parentId: parent!.id }),
    });
    setSubmitting(false);

    if (!res.ok) {
      toast.error(res.error);
      // A duplicate-parent error means they should pick the existing one instead.
      if (res.error.toLowerCase().includes("existing parents list")) {
        setAddingNewParent(false);
        setStep(2);
      }
      return;
    }

    toast.success("Student created");
    setCreated(res.data);
  }

  function reset() {
    setStudent(emptyStudent);
    setTeacher(null);
    setParent(null);
    setNewParent(emptyNewParent);
    setAddingNewParent(false);
    setErrors({});
    setStep(0);
    setCreated(null);
  }

  // ============ SUCCESS SCREEN ============
  if (created) {
    const tempPassword = created.parent?.temporaryPassword;
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
            <Check className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-bold text-night-900">
              {created.name} has been added
            </h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              Save the details below — they won&rsquo;t be shown again.
            </p>
          </div>
        </div>

        {/* Student code */}
        <div className="mb-4 rounded-md border border-cream-200 bg-cream-100 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink-soft">Student code</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-wider text-night-900">
                {created.studentCode}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                The student signs in with this code.
              </p>
            </div>
            <CopyButton value={created.studentCode} label="Student code" />
          </div>
        </div>

        {/* Temporary parent password — only when a parent was created inline */}
        {tempPassword && (
          <div className="mb-6 rounded-md border border-warn/40 bg-warn/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warn" aria-hidden />
              <p className="text-sm font-semibold text-night-900">
                A parent account was created
              </p>
            </div>
            <p className="mb-3 text-sm text-ink-soft">
              Give <strong>{created.parent.name}</strong> this temporary
              password. It cannot be recovered later.
            </p>
            <div className="flex items-center justify-between gap-4 rounded-sm bg-cream-50 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-ink-soft">
                  {created.parent.user?.email}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-bold text-night-900">
                  <KeyRound className="h-4 w-4 text-ink-soft" aria-hidden />
                  {tempPassword}
                </p>
              </div>
              <CopyButton value={tempPassword} label="Password" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" block className="flex-1" onClick={reset}>
            Add another student
          </Button>
          <Button
            type="button"
            variant="ghost"
            block
            className="flex-1"
            onClick={() => router.push("/dashboard/institute")}
          >
            Back to dashboard
          </Button>
        </div>
      </Card>
    );
  }

  // ============ WIZARD ============
  return (
    <Card className="mx-auto w-full max-w-2xl">
      {/* Stepper */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                      done
                        ? "border-gold-500 bg-gold-500 text-night-900"
                        : active
                          ? "border-gold-500 text-gold-600"
                          : "border-cream-200 text-ink-soft",
                    ].join(" ")}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? (
                      <Check className="h-4 w-4" aria-hidden />
                    ) : (
                      <Icon className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                  <span
                    className={[
                      "hidden text-xs font-medium sm:block",
                      active || done ? "text-night-900" : "text-ink-soft",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={[
                      "mb-5 h-0.5 flex-1 rounded transition-colors",
                      step > s.id ? "bg-gold-500" : "bg-cream-200",
                    ].join(" ")}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ---- Step 0: student details ---- */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-night-900">
              Student details
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Tell us about the child.
            </p>
          </div>

          <Input
            label="Full name"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            error={errors.name}
            placeholder="e.g. Abdullah Rahman"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Class"
              value={student.class}
              onChange={(e) =>
                setStudent({ ...student, class: e.target.value })
              }
              error={errors.class}
              placeholder="e.g. Nursery"
            />
            <Input
              label="Date of birth"
              type="date"
              value={student.dob}
              onChange={(e) => setStudent({ ...student, dob: e.target.value })}
              error={errors.dob}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <Select
            label="Gender"
            value={student.gender}
            onChange={(e) => setStudent({ ...student, gender: e.target.value })}
            error={errors.gender}
          >
            <option value="">Select…</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </Select>

          <Input
            label="Allergies (optional)"
            value={student.allergies}
            onChange={(e) =>
              setStudent({ ...student, allergies: e.target.value })
            }
            error={errors.allergies}
            placeholder="e.g. Peanuts — leave blank if none"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-cream-200 bg-cream-50 p-4">
            <input
              type="checkbox"
              checked={student.photoConsent}
              onChange={(e) =>
                setStudent({ ...student, photoConsent: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 accent-gold-500"
            />
            <span>
              <span className="block text-sm font-medium text-night-900">
                Photo consent
              </span>
              <span className="block text-sm text-ink-soft">
                The parent permits photos of this child to be used by the
                institute.
              </span>
            </span>
          </label>
        </div>
      )}

      {/* ---- Step 1: teacher ---- */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-night-900">
              Assign a teacher
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Search your institute&rsquo;s teachers by name, email, or phone.
            </p>
          </div>

          <SearchPicker
            label="Teacher"
            placeholder="Search teachers…"
            onSearch={searchTeachers}
            selected={teacher}
            onSelect={setTeacher}
            error={errors.teacher}
          />
        </div>
      )}

      {/* ---- Step 2: parent ---- */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-night-900">Link a parent</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Search for the parent. If they&rsquo;re not here yet, you can add
              them.
            </p>
          </div>

          {!addingNewParent ? (
            <SearchPicker
              label="Parent"
              placeholder="Search by name, email, or phone…"
              onSearch={searchParents}
              selected={parent}
              onSelect={setParent}
              error={errors.parent}
              emptyAction={
                <Button
                  type="button"
                  variant="night"
                  size="sm"
                  onClick={() => {
                    setAddingNewParent(true);
                    setParent(null);
                    setErrors({});
                  }}
                >
                  <Users className="h-4 w-4" aria-hidden />
                  Add a new parent
                </Button>
              }
            />
          ) : (
            <div className="rounded-md border border-cream-200 bg-cream-50 p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-night-900">New parent</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    An account will be created and a temporary password issued.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAddingNewParent(false);
                    setNewParent(emptyNewParent);
                    setErrors({});
                  }}
                  className="shrink-0 text-sm font-medium text-gold-600 underline underline-offset-2"
                >
                  Search instead
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="Parent name"
                  value={newParent.name}
                  onChange={(e) =>
                    setNewParent({ ...newParent, name: e.target.value })
                  }
                  error={errors.name}
                  placeholder="e.g. Rahim Uddin"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    value={newParent.email}
                    onChange={(e) =>
                      setNewParent({ ...newParent, email: e.target.value })
                    }
                    error={errors.email}
                    placeholder="parent@example.com"
                  />
                  <Input
                    label="Phone"
                    value={newParent.phone}
                    onChange={(e) =>
                      setNewParent({ ...newParent, phone: e.target.value })
                    }
                    error={errors.phone}
                    placeholder="e.g. 01711223344"
                  />
                </div>
                <Input
                  label="Relation"
                  value={newParent.relation}
                  onChange={(e) =>
                    setNewParent({ ...newParent, relation: e.target.value })
                  }
                  error={errors.relation}
                  placeholder="e.g. Father"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- Step 3: review ---- */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-night-900">Review</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Check everything before creating the student.
            </p>
          </div>

          <dl className="divide-y divide-cream-200 rounded-md border border-cream-200 bg-cream-50">
            {[
              ["Name", student.name],
              ["Class", student.class],
              ["Date of birth", student.dob],
              ["Gender", student.gender === "MALE" ? "Male" : "Female"],
              ["Allergies", student.allergies || "None"],
              ["Photo consent", student.photoConsent ? "Given" : "Not given"],
              ["Teacher", teacher?.title ?? "—"],
              [
                "Parent",
                addingNewParent
                  ? `${newParent.name} (new · ${newParent.relation})`
                  : (parent?.title ?? "—"),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 px-4 py-3"
              >
                <dt className="text-sm text-ink-soft">{label}</dt>
                <dd className="text-right text-sm font-medium text-night-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {addingNewParent && (
            <p className="flex items-start gap-2 rounded-md bg-warn/10 px-4 py-3 text-sm text-night-900">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-warn"
                aria-hidden
              />
              A new parent account will be created for {newParent.email}. Save
              the temporary password shown afterwards — it can&rsquo;t be
              recovered.
            </p>
          )}
        </div>
      )}

      {/* ---- Nav ---- */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || submitting}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-5 text-sm font-semibold text-ink-soft transition-colors hover:text-night-900 disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>

        {step < 3 ? (
          <Button type="button" onClick={next}>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button type="button" onClick={submit} loading={submitting}>
            {submitting ? "Creating…" : "Create student"}
          </Button>
        )}
      </div>
    </Card>
  );
}
