import { useModal } from "@/contexts/ModalContext";
import styles from "./SingleDesignView.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DesignDto, DesignService, ApiError } from "@/api/generated";
import { DownloadScreenshotButton } from "@/elements/DownloadScreenshotButton/DownloadScreenshotButton";
import { useRouter } from "next/navigation";

export default function SingleDesignView() {
  const { modalState, closeModal } = useModal();
  const [design, setDesign] = useState<DesignDto | undefined>();
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null
  );
  const [isEditNameMode, setIsEditNameMode] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (modalState.type != "single-design-view") return;
    const designId = modalState.data.designId;

    const fetchDesignById = async (designId: number) => {
      setStatus("loading");
      try {
        const result = await DesignService.getDesignById(designId);
        if (result) {
          setStatus("success");
          setErrorMessage("");
          setDesign(result);
        }
      } catch (error) {
        setStatus("error");
        setDesign(undefined);
        setErrorMessage(
          error instanceof ApiError
            ? error.body?.errors?.[0] || "There was an error loading the design"
            : "An unexpected error occurred"
        );
      }
    };
    fetchDesignById(designId);
  }, [modalState]);

  async function handleDelete() {
    try {
      if (!design) return;
      await DesignService.deleteDesign(design.id);
      console.log("About to call onDelete callback");
      if (
        modalState.type == "single-design-view" &&
        modalState.callbacks.onDelete
      ) {
        modalState.callbacks.onDelete();
        console.log("onDelete callback called");
      }
      closeModal();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof ApiError
          ? error.body?.errors?.[0] || "There was an error deleting the design"
          : "An unexpected error occurred"
      );
    }
  }

  if (status === "loading") {
    return <>Loading...</>;
  }

  if (status === "error") {
    return <>{errorMessage && <p>{errorMessage}</p>}</>;
  }

  if (status === "success" && design) {
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
          </button>{" "}
          <DownloadScreenshotButton
            screenshotUrl={design.screenshotUrl}
            designName={design.name || "design"}
          />
          <button onClick={handleDelete}>Delete</button>
        </div>
      </>
    );
  }
}
