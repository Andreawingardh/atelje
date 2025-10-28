'use client'

import { ApiError, DesignDto, DesignService } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";

export function useDesign() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [error, setError] = useState<string>();
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const [currentDesign, setCurrentDesign] = useState<DesignDto | undefined>(undefined);

    async function createDesign(name: string, sceneData: string): Promise<DesignDto | undefined> {

        try {
            setSucceeded(false)
            setIsLoading(true);
            const result = await DesignService.createDesign({name, userId: user!.userId, designData: sceneData});
            return result
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.body?.errors?.[0] || "An error occurred")
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function saveDesign(designId: number, name: string, designData: string) {

        try {
            setIsLoading(true)
            await DesignService.updateDesign(designId, {name, designData})
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.body?.errors?.[0] || "An error occurred")
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false)
        }

    }

    const loadDesign = useCallback(async (id: number) => {
        const designId = id

        try {
            setIsLoading(true)
            const response = await DesignService.getDesignById(designId)
            return response;
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.body?.errors?.[0] || "An error occurred")
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false)
        }


    }, [])
    return {
        createDesign, saveDesign, loadDesign, currentDesign, error, isLoading, succeeded
    }

}

