import Link from "next/link";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthScreen title="Create account" subtitle="For parents to follow their child">
      <RegisterForm />
      <div className="mt-6 text-center">
        <Link href="/login/parent" className="text-sm text-cream-100/70 underline underline-offset-2 hover:text-cream-50">
          Already have an account? Sign in
        </Link>
      </div>
    </AuthScreen>
  );
}
