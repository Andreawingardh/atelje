"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LogOutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  function handleOnClick() {
    logout();
    router.push("/login");
  }

  return <button onClick={handleOnClick}>Logout</button>;
}
