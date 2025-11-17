"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./UserInfo.module.css";
import Image from "next/image";
import { useUser } from "./useUser";
import { useState } from "react";

export default function UserInfo() {
  const { user } = useAuth();
  const { deleteAccount, updateDisplayName, error, isLoading } = useUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || "");
  console.log("UserInfo rendering, user:", user);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>Profile</h2>
      {error && <p>{error}</p>}
      <hr />
      {isEditMode ? (
        <>
          <h3>{user?.displayName}</h3>
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <button
            onClick={() => updateDisplayName(editedName)}
            disabled={isLoading}
          >
            Save
          </button>

          <hr />
          <h3>Danger Zone</h3>
          <button
            onClick={() => {
              deleteAccount();
            }}
          >
            Delete
          </button>
          <hr />
          <button onClick={() => setIsEditMode(false)}>Done</button>
        </>
      ) : (
        <>
          <h3>{user?.displayName}</h3>
          <Image src={"/241113-doge.jpg"} width={100} height={100} alt="hej" />
          <h3>Mail</h3>
          <p>{user?.email}</p>
          <button onClick={() => setIsEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}
