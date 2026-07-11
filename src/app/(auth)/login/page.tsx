import Link from "next/link";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  return (
    <AuthScreen title="Welcome back" subtitle="Sign in to continue">
      <LoginForm />
      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link
          href="/register"
          className="font-semibold text-gold-300 underline underline-offset-2"
        >
          New parent? Create an account
        </Link>
        <Link
          href="/login/student"
          className="text-cream-100/70 underline underline-offset-2 hover:text-cream-50"
        >
          I&rsquo;m a student
        </Link>
      </div>
    </AuthScreen>
  );
}
