import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const InfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  content: ReactNode;
}> = ({ isOpen, onClose, content }) => {
  return (
    <div
      className={twMerge(
        "fixed inset-0 bg-black/70 flex justify-center items-center transition h-screen",
        isOpen && "opacity-100 z-10",
        !isOpen && "opacity-0 -z-10"
      )}
      onClick={() => onClose()}
    >
      <div className="w-4/5 h-[80vh] overflow-y-auto bg-white rounded-lg p-4">
        <div className="max-w-[700px] mx-auto ">{content}</div>
      </div>
    </div>
  );
};
