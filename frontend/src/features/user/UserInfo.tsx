"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./UserInfo.module.css";
import Image from "next/image";
import { useUser } from "./useUser";
import { useState } from "react";
import AlertBadge from "@/elements/AlertBadge/AlertBadge";
import Button from "@/elements/Button/Button";
import ProfileInitial from "@/elements/ProfileInitial/ProfileInitial";
import TextInput from "@/elements/TextInput/TextInput";

export default function UserInfo() {
  const { user } = useAuth();
  const { deleteAccount, updateDisplayName, error, isLoading } = useUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || "");

  if (!user) {
    return null;
  }

  return (
    <section className={styles.profileSection}>
      <div className={styles.titleContainer}>
        <h2>Profile</h2>
        {!isEditMode ? (
          <button className={styles.editButton} onClick={() => setIsEditMode(true)}>
            <img className={styles.editIcon} src="/icons/edit-icon.svg" alt="Edit Profile" />
          </button>
        ) : (
          <Button variant="cornflower" buttonText="Done" onClick={() => setIsEditMode(false)}/>
        )}
      </div>
      <hr className={styles.titleDivider}/>
      {error && <AlertBadge message={error} variant="error"/>}
      {isEditMode ? (
        <>
          <h3 className={styles.displayName}>{user?.displayName}</h3>
          <ProfileInitial variant="cornflower" userDisplayName={user?.displayName || "User"}/>
          <TextInput
            variant="snowdrop"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <Button
            variant="cornflower"
            buttonText="Save"
            onClick={() => updateDisplayName(editedName)}
            disabled={isLoading}
          />
          <div className={styles.deleteDivider}>
            <h3 className={styles.deleteDividerTitle}>Danger Zone</h3>
            <Button
              variant="rosie"
              buttonText="Delete Account"
              onClick={() => {
                deleteAccount();
              }}
            />
          </div>
        </>
      ) : (
        <>
          <h3 className={styles.displayName}>{user?.displayName}</h3>
          <ProfileInitial variant="cornflower" userDisplayName={user?.displayName || "User"}/>
          <h3>Mail</h3>
          <p className={styles.email}>{user?.email}</p>
        </>
      )}
    </section>
  );
}
