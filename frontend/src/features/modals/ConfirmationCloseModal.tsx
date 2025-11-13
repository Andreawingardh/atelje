import { useModal } from "@/contexts/ModalContext";

export default function ConfirmationCloseModal() {
  const { closeModal,modalState} = useModal();

  if (modalState.type !== "confirmation-close") return null;

  const { onConfirm, onCancel } = modalState.callbacks;

  return (
    <div>
      <p>
        Are you sure you want to close the window? You may have unsaved changes.
      </p>
      <button onClick={() => { onCancel(); closeModal(); }}>Stay</button>
      <button onClick={() => { onConfirm(); closeModal(); }}>Leave</button>
    </div>
  );
}
