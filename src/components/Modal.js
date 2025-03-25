import { FaX } from "react-icons/fa6";

const Modal = ({ onClose, children }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg shadow-lg min-w-[300px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-5 hover:text-red-500"
        >
          <FaX size={15} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
