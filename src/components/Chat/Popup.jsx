// ChatPopup.jsx
import { useState } from "react";
import ChatUI from "./Chat-ui";
import { X } from "lucide-react";

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-7 right-7 m-2 z-20">
      {!isOpen && (
        <div className="btn btn-ghost">
          <img
            src="aimed.png"
            alt="logo"
            width="80"
            height="80"
            onClick={handleToggle}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
      {isOpen && (
        <div className="relative">
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={handleToggle}
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
          <ChatUI />
        </div>
      )}
    </div>
  );
}