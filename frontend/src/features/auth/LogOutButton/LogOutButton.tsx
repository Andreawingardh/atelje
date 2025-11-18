"use client";

import { useAuth } from "@/contexts/AuthContext";
import Button from "@/elements/Button/Button";

export default function LogOutButton() {
  const { logout } = useAuth();

  function handleOnClick() {
    logout();
  }

  return <Button onClick={handleOnClick} variant="snowdrop" buttonText="Sign out"></Button>;
}
