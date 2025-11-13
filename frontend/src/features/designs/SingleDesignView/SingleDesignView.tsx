import { useModal } from "@/contexts/ModalContext";
import styles from "./SingleDesignView.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DesignDto } from "@/api/generated";
import { DownloadScreenshotButton } from "@/elements/DownloadScreenshotButton/DownloadScreenshotButton";
import { useRouter } from "next/navigation";

export default function SingleDesignView() {
  const { modalState, closeModal } = useModal();
  const [design, setDesign] = useState<DesignDto | undefined>();
  const [isEditNameMode, setIsEditNameMode] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (modalState.type != "single-design-view") return;
    setDesign(modalState.data.design);
  }, []);

  if (design) {
    return (
      <>
        <Image
          src={design.screenshotUrl!}
          alt={design.name || "Design preview"}
          // Temporary fixed size, remove after styling
          width={600}
          height={600}
        />
        <div className={styles.informationWrapper}>
          {isEditNameMode ? (
            <>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={design.name!}
              />
              <button
                onClick={() => {
                  if (
                    modalState.type == "single-design-view" &&
                    modalState.callbacks.saveDesignName
                  ) {
                    modalState.callbacks.saveDesignName(design.id, editedName);
                    setDesign((prev) => {
                      if (!prev) return prev; // or return undefined
                      return { ...prev, name: editedName };
                    });
                    setIsEditNameMode(false);
                  }
                }}
              >
                Save
              </button>
              <button onClick={() => setIsEditNameMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p>{design.name}</p>
              <button onClick={() => setIsEditNameMode(true)}>
                Update name
              </button>
            </>
          )}
          <button
            onClick={() => {
              router.push(`/designer/${design.id}`);
              closeModal();
            }}
          >
            Edit
          </button>
          <DownloadScreenshotButton
            screenshotUrl={design.screenshotUrl}
            designName={design.name || "design"}
          />
          <button
            onClick={() => {
              if (
                modalState.type == "single-design-view" &&
                modalState.callbacks.onDelete
              ) {
                modalState.callbacks.onDelete(design.id);
                closeModal();
              }
            }}
          >
            Delete
          </button>
        </div>
      </>
    );
  }
}
