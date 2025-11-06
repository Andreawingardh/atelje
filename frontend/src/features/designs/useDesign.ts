'use client'

import { ApiError, DesignDto, DesignService } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import { uploadScreenshotsToR2 } from "@/lib/uploadScreenshots";

export function useDesign() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [error, setError] = useState<string>();
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const [currentDesign, setCurrentDesign] = useState<DesignDto | undefined>(undefined);

    async function createDesign(name: string, sceneData: string, screenshots?: { fullBlob: Blob; thumbnailBlob: Blob }): Promise<DesignDto | undefined> {

        try {
            setSucceeded(false)
            setIsLoading(true);
            // Create design (without screenshots)
            const design = await DesignService.createDesign({ 
                name, 
                userId: user!.userId, 
                designData: sceneData 
            });
            
            // If screenshots provided, upload them
            if (screenshots && design.id) {
                try {
                    
                    const { screenshotUrl, thumbnailUrl } = await uploadScreenshotsToR2(
                        design.id,
                        screenshots.fullBlob,
                        screenshots.thumbnailBlob
                    );
                    
                    // Update design with screenshot URLs
                    const updatedDesign = await DesignService.updateDesign(design.id, {
                        screenshotUrl,
                        thumbnailUrl
                    });
                    
                    return updatedDesign;
                    
                } catch (screenshotError) {
                    console.warn('Screenshot upload failed, but design was saved:', screenshotError);
                    // Design saved without screenshots
                    return design;
                }
            }
            
            return design;
        } catch (error) {
            setError(
                error instanceof ApiError
                    ? (error.body?.errors?.[0] || "An error occurred")
                    : "An unexpected error occurred"
            );
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }

    async function saveDesign(designId: number, name: string, designData: string) {

        try {
            setIsLoading(true)
            const response = await DesignService.updateDesign(designId, { name, designData })
            return response;
        } catch (error) {
            setError(
                error instanceof ApiError
                    ? (error.body?.errors?.[0] || "An error occurred")
                    : "An unexpected error occurred"
            );
            return undefined;
        } finally {
            setIsLoading(false)
        }

    }

    const loadDesign = useCallback(async (id: number) => {
        const designId = id

        try {
            setIsLoading(true)
            const response = await DesignService.getDesignById(designId)
            setCurrentDesign(response)
            return response;
        } catch (error) {
            setError(
                error instanceof ApiError
                    ? (error.body?.errors?.[0] || "An error occurred")
                    : "An unexpected error occurred"
            );
            return undefined;
        } finally {
            setIsLoading(false)
        }


    }, [])
    return {
        createDesign, saveDesign, loadDesign, currentDesign, error, isLoading, succeeded
    }

}

