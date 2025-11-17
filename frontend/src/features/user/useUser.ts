import { UserService } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/api/generated";

export function useUser() {
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user, setUser, logout } = useAuth();
    const router = useRouter();

    const deleteAccount = async () => {
        if (!user) throw new Error('No user logged in');

        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This will permanently delete all your designs."
        );

        if (!confirmed) return false;

        setIsLoading(true);
        try {
            await UserService.deleteUserById(user.userId)
            logout();
            router.push('/')
            return true;
        } catch (error) {
            setError(
                error instanceof ApiError
                    ? error.body?.errors?.[0] || "Failed to delete your account."
                    : "An unexpected error occurred"
            );
            return false;
        } finally {
            setIsLoading(false)
        }
    }

        const updateDisplayName = async (newDisplayName: string) => {
            if (!user) throw new Error("No user logged in")

            setIsLoading(true)
            try {
                const updatedUser = await UserService.updateUserById(user.userId, { displayName: newDisplayName })
                setUser({
                    ...user,
                    displayName: updatedUser.displayName
                });
                return updatedUser;
            } catch (error) {
                setError(
                    error instanceof ApiError
                        ? error.body?.errors?.[0] || "There was an error updating the design name"
                        : "An unexpected error occurred"
                );
                return null;
            } finally {
                setIsLoading(false)
            }
        };

        return {
            deleteAccount,
            updateDisplayName,
            error,
            isLoading
        };
    }