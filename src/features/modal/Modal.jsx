import { useThemeContext } from "../theme/context/ThemeContext";
import "./modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  const { theme } = useThemeContext();

  const onClose = () => {
    setIsModalOpen(false);
    document.body.classList.remove("lock-scroll");
  };

  return (
    <div onClick={onClose} className="modal" aria-expanded={isModalOpen}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal__container modal__container--${theme}`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`modal__button modal__button--${theme}`}
          aria-label="close modal"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
