import { Suspense } from "react";

import { LoginForm } from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ice px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
