import { useModal } from "@/contexts/ModalContext";

export default function ConfirmationCloseModal() {
  const { modalCallbacks, closeModal } = useModal();

  function handleCancelClick() {
    if (modalCallbacks.onCancel) modalCallbacks.onCancel();
    closeModal();
  }

  function handleConfirmClick() {
    if (modalCallbacks.onConfirm) modalCallbacks.onConfirm();
    closeModal();
  }

  return (
    <div>
      <p>
        Are you sure you want to close the window? You may have unsaved changes.
      </p>
      <button onClick={handleCancelClick}>Stay</button>
      <button onClick={handleConfirmClick}>Leave</button>
    </div>
  );
}
