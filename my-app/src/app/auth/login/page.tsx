import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex justify-center items-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
