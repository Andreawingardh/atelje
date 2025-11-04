"use client";

import ConfirmEmailComponent from "@/features/auth/ConfirmEmail/ConfirmEmailComponent";
import { Suspense } from "react";

function ConfirmEmailComponentFallback() {
  return (
    <>
      Hi! To access this page and confirm your account, you need to follow a
      link from your email.
    </>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmEmailComponentFallback />}>
      <ConfirmEmailComponent />
    </Suspense>
  );
}
