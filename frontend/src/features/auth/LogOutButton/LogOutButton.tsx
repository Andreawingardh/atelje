"use client";

import { useAuth } from "@/contexts/AuthContext";
import Button from "@/elements/Button/Button";
import { useRouter } from "next/navigation";

export default function LogOutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  function handleOnClick() {
    logout();
    router.push("/login");
  }

  return <Button onClick={handleOnClick} variant="snowdrop" buttonText="Log out"></Button>;
}
