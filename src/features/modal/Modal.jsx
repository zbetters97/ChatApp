import "./modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  function onClose() {
    setIsModalOpen(false);
    document.body.classList.remove("lock-scroll");
  }

  return (
    <div onClick={onClose} className="modal" aria-expanded={isModalOpen}>
      <div onClick={(e) => e.stopPropagation()} className="modal__container">
        <button
          type="button"
          onClick={onClose}
          className="modal__button"
          aria-label="close modal"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
