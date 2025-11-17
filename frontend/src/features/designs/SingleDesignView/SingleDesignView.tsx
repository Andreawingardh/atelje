import { useModal } from "@/contexts/ModalContext";
import styles from "./SingleDesignView.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DesignDto } from "@/api/generated";
import { DownloadScreenshotButton } from "@/elements/DownloadScreenshotButton/DownloadScreenshotButton";
import { useRouter } from "next/navigation";
import TextInput from "@/elements/TextInput/TextInput";
import Button from "@/elements/Button/Button";
import CircleButton from "@/elements/CircleButton/CircleButton";

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

  if (!design) return null;

    return (
      <>
      <div className={styles.imageWrapper}>
        <Image
          src={design.screenshotUrl!}
          alt={design.name || "Design preview"}
          width={600}
          height={600}
          className={styles.screenshotImage}
        />
      </div>
        <div className={styles.informationWrapper}>
        <div className={styles.actionDivider}>
          {isEditNameMode ? (
            <>
              <TextInput
                variant="vanilla"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={design.name!}
              />
              <Button
                variant="cornflower"
                buttonText="Save"
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
              />
              <Button variant="rosie" buttonText="Cancel" onClick={() => setIsEditNameMode(false)}/>
            </>
          ) : (
            <>
              <h1>{design.name}</h1>
              <Button 
                variant="cornflower" 
                buttonText="Update name" 
                buttonIcon="./icons/edit-white-icon.svg"
                onClick={() => setIsEditNameMode(true)}
              />
            </>
          )}
        </div>
        <div className={styles.actionDivider}>
          <CircleButton
            buttonIcon="./icons/edit-icon.svg"
            onClick={() => {
              router.push(`/designer/${design.id}`);
              closeModal();
            }}
          />
          <DownloadScreenshotButton
            screenshotUrl={design.screenshotUrl}
            designName={design.name || "design"}
          />
          <Button
            variant="rosie"
            buttonText="Delete"
            onClick={() => {
              if (
                modalState.type == "single-design-view" &&
                modalState.callbacks.onDelete
              ) {
                modalState.callbacks.onDelete(design.id);
                closeModal();
              }
            }}
          />
        </div>
      </div>
      </>
    );
  }

