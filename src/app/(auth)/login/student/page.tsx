import Link from "next/link";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { StudentLoginForm } from "@/components/auth/StudentLoginForm";

export default function StudentLoginPage() {
  return (
    <AuthScreen title="Welcome back" subtitle="Enter your student code">
      <StudentLoginForm />
      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-cream-100/70 underline underline-offset-2 hover:text-cream-50">
          Not a student? Sign in here
        </Link>
      </div>
    </AuthScreen>
  );
}
