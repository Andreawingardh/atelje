'use client'

import { ApiError, AuthService, CreateDesignDto, DesignService, UpdateDesignDto, UserDto } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getSceneData = (): string => {
  // Simple JSON string for testing
  return JSON.stringify({ message: "hello world", timestamp: Date.now() });
};

const loadSceneData = (jsonString: string): void => {
  console.log('Mock: Received data from backend:', jsonString);
  try {
    const data = JSON.parse(jsonString);
    console.log('Mock: Parsed successfully:', data);
  } catch (error) {
    console.error('Mock: Failed to parse scene data:', error);
  }
};


export function useDesign() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string>();
    const [succeeded, setSucceeded] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }

    },)

    async function createDesign(name: string) {
        const designData = getSceneData();

        const createDesignDto: CreateDesignDto = {
            name: name,
            userId: user!.userId,
            designData: designData
        }
        try {
            setSucceeded(false)
            setIsLoading(true);
            const result = await DesignService.createDesign(createDesignDto);
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

    async function saveDesign(designId: number, name: string) {

        const designData = getSceneData();

        const updateDesignDto: UpdateDesignDto = {
            name: name,
            designData: designData
        }

        try {
            setIsLoading(true)
            await DesignService.updateDesign(designId, updateDesignDto)
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

    async function loadDesign(id: number) {
        const designId = id

        try {
            setIsLoading(true)
            const response = await DesignService.getDesignById(designId)
            if (response) {
                loadSceneData(response.designData)
            }
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
        return {
            createDesign, saveDesign, loadDesign, error, isLoading, succeeded
        }

}

