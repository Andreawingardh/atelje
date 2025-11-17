import { useAuth } from "@/contexts/AuthContext";
import styles from "./UserDesigns.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useModal } from "@/contexts/ModalContext";
import { useDesign } from "../designs/useDesign";
import { DesignDto } from "@/api/generated";
import LoadingSpinner from "@/elements/LoadingSpinner/LoadingSpinner";
import AlertBadge from "@/elements/AlertBadge/AlertBadge";

export default function UserDesigns() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<DesignDto[]>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { openModal } = useModal();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { getMyDesigns, deleteDesign, updateDesignName, error, isLoading } =
    useDesign();

  useEffect(() => {
    (async () => {
      const getDesigns = async () => {
        if (!user) {
          return null;
        }
        const result = await getMyDesigns();
        return result;
      };
      const designs = await getDesigns();
      if (designs != undefined && designs != null) {
        setDesigns(designs);
      }
    })();
  }, [user, refreshTrigger]);

  async function handleDeleteClick(id: number) {
    await deleteDesign(id);
    setSuccessMessage("Design deleted");
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => setSuccessMessage(null), 3000);
  }

  async function handleSaveDesignName(designId: number, newName: string) {
    await updateDesignName(designId, newName);
    setSuccessMessage("Design name updated");

    // 2. Update the designs array in state
    setDesigns((prev) =>
      prev?.map((d) => (d.id === designId ? { ...d, name: newName } : d))
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  return (
    <section className={styles.userDesignsSection}>
      <div>
        <h2>My Designs</h2>
        <hr className={styles.titleDivider}/>
      </div>
      {error && <AlertBadge message={error} variant="warning" />}
      {successMessage && <AlertBadge message={successMessage} variant="success" />}

      <div className={styles.designsGrid}>
        {isLoading && <LoadingSpinner />}
        {designs?.map((design) => (
          <button
            className={styles.designCard}
            onClick={() =>
              openModal("single-design-view", {
                data: { design: design },
                callbacks: {
                  onDelete: handleDeleteClick,
                  saveDesignName: handleSaveDesignName,
                },
              })
            }
            key={design.id}
          >
            {design.thumbnailUrl ? (
              <Image
                className={styles.designThumbnail}
                src={design.thumbnailUrl}
                alt={design.name || "Design preview"}
                // Temporary fixed size, remove after styling
                width={200}
                height={200}
              />
            ) : (
              <div>
                <span>No Preview</span>
              </div>
            )}

            <p className={styles.designName}>{design.name}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
