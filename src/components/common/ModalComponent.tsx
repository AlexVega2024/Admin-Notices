import "../../styles/Modal.css";

type ModalComponentProps = {
  onClose: () => void;
};

export const ModalComponent = ({ onClose }: ModalComponentProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1>Modal</h1>
        <button className="modal-close" onClick={onClose}>
          <span className="text-secondary fw-bold">X</span>
        </button>
      </div>
    </div>
  );
};
