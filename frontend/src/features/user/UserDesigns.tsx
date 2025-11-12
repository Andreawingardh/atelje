import { useAuth } from "@/contexts/AuthContext";
import styles from "./UserDesigns.module.css";
import { DesignService, ApiError, DesignDto } from "@/api/generated";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useModal } from "@/contexts/ModalContext";

export default function UserDesigns() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [designs, setDesigns] = useState<DesignDto[]>();
  const { openModal } = useModal();

  useEffect(() => {
    (async () => {
      const getAllDesigns = async () => {
        if (!user) {
          return null;
        }
        try {
          const designs = await DesignService.getMyDesigns();
          console.log(designs);
          return designs;
        } catch (error) {
          setError(
            error instanceof ApiError
              ? error.body?.errors?.[0] || "An error occurred"
              : "An unexpected error occurred"
          );
          return undefined;
        } finally {
          setIsLoading(false);
        }
      };
      const designs = await getAllDesigns();
      if (designs != undefined) {
        setDesigns(designs);
      }
    })();
  }, [user]);

  return (
    <div>
      {error && <p>{error}</p>}
      <h1>My Designs</h1>

      {isLoading && <p>Loading designs...</p>}
    
      <div>
        {designs?.map((design) => (
          <button onClick={() => openModal("single-design-view")} key={design.id}>
            {design.thumbnailUrl ? (
              <Image
                src={design.thumbnailUrl}
                alt={design.name || 'Design preview'}
                // Temporary fixed size, remove after styling
                width={200}
                height={200}
              />
            ) : (
              <div>
                <span>No Preview</span>
              </div>
            )}
          
            <div>{design.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
