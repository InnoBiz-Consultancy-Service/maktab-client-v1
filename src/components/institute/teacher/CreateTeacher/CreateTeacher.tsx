"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Calendar1,
  Captions,
} from "lucide-react";
import { Input, Card } from "@/components/ui";
import {
  createTeacherAction,
  CreateTeacherState,
} from "@/actions/institute/teacher/create-teacher";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Batch } from "../../../../types/institute/batch/index";

const initialState: CreateTeacherState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-8 font-display text-[15px] font-semibold text-night-900 shadow-soft transition-all hover:scale-[1.01] hover:shadow-[0_0_28px_rgba(245,184,51,0.4)] active:scale-95 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Creating…
        </>
      ) : (
        "Create teacher"
      )}
    </button>
  );
}

export function CreateTeacherForm({ batch }: { batch: Batch[] }) {
  const [state, formAction] = useActionState(createTeacherAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // console.log("batch", batch);
  const [selectedClasses, setSelectedClasses] = useState<
    { id: string; name: string }[]
  >([]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) return;

    const selected = batch.find((item) => String(item.id) === value);

    if (!selected) return;

    setSelectedClasses((prev) => {
      if (prev.some((item) => item.id === selected.id)) return prev;
      return [...prev, selected];
    });

    // select reset
    e.target.value = "";
  };

  const removeClass = (id: string) => {
    setSelectedClasses((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (state.success && state.createdTeacher) {
      toast.success(`${state.createdTeacher.name} was added as a teacher.`);
      formRef.current?.reset();
    } else if (state.formError) {
      toast.error(state.formError);
    }
  }, [state]);

  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-night-900">Add a teacher</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Create a teacher account for your institute. They&rsquo;ll sign in
          with the email and password you set here.
        </p>
      </div>

      {state.success && state.createdTeacher && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-night-900"
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-success"
            aria-hidden
          />
          <span>
            <strong>{state.createdTeacher.name}</strong> has been added. You can
            create another below.
          </span>
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full name"
            name="name"
            defaultValue={v.name}
            error={err.name}
            placeholder="e.g. Ustadh Ahmad"
            autoComplete="name"
            icon={<User className="h-[18px] w-[18px]" aria-hidden />}
          />
          <Select
            label="Gender"
            name="gender"
            defaultValue={v.gender}
            error={err.gender}
          >
            <option value="">Select…</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={v.email}
            error={err.email}
            placeholder="teacher@example.com"
            autoComplete="off"
            icon={<Mail className="h-[18px] w-[18px]" aria-hidden />}
          />
          <Input
            label="Phone"
            name="phone"
            defaultValue={v.phone}
            error={err.phone}
            placeholder="e.g. 07123 456789"
            autoComplete="off"
            icon={<Phone className="h-[18px] w-[18px]" aria-hidden />}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              defaultValue={v.password}
              error={err.password}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              icon={<Lock className="h-[18px] w-[18px]" aria-hidden />}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-[38px] text-ink-soft transition-colors hover:text-night-900"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" aria-hidden />
              ) : (
                <Eye className="h-[18px] w-[18px]" aria-hidden />
              )}
            </button>
          </div>
          <Input
            label="Education"
            name="education"
            defaultValue={v.education}
            error={err.education}
            placeholder="e.g. BA in Islamic Studies, Hifz"
            icon={<GraduationCap className="h-[18px] w-[18px]" aria-hidden />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Job title"
            name="jobTitle"
            defaultValue={v.jobTitle}
            error={err.jobTitle}
            placeholder="e.g. Quran Teacher, Admin"
            icon={<Captions className="h-[18px] w-[18px]" aria-hidden />}
          />

          <Input
            label="Start date"
            name="startDate"
            type="date"
            defaultValue={v.startDate}
            error={err.startDate}
            icon={<Calendar1 className="h-[18px] w-[18px]" aria-hidden />}
          />
        </div>

        <div>
          {/* Selected Tags */}
          <div
            className={`${selectedClasses.length > 0 && "mb-2"}  flex flex-wrap gap-2`}
          >
            {selectedClasses.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded bg-blue-100 px-3 py-1 text-sm"
              >
                <span>{item.name}</span>

                <button
                  type="button"
                  onClick={() => removeClass(item.id)}
                  className="font-bold text-red-500 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <Select
            label="Classes"
            name="batchId"
            defaultValue=""
            onChange={handleSelect}
          >
            <option value="">Select Classes</option>

            {batch.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={selectedClasses.some(
                  (selected) => selected.id === item.id,
                )}
              >
                {item.name}
              </option>
            ))}
          </Select>
          <input
            type="hidden"
            name="assignedClasses"
            value={JSON.stringify(selectedClasses.map((item) => item.id))}
          />
        </div>

        <Input
          label="Address"
          name="address"
          defaultValue={v.address}
          error={err.address}
          placeholder="Street, city, postcode"
          autoComplete="off"
          icon={<MapPin className="h-[18px] w-[18px]" aria-hidden />}
        />
        <Textarea
          label="Notes"
          name="notes"
          defaultValue={v.notes}
          error={err.notes}
          placeholder="Additional notes about the teacher..."
        />

        <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
          <SubmitButton />
          <p className="text-xs text-ink-soft">
            The teacher&rsquo;s account is linked to your institute
            automatically.
          </p>
        </div>
      </form>
    </Card>
  );
}
