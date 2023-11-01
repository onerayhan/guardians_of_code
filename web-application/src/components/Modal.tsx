import React, { FC, useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import {useIsAuthenticated} from 'react-auth-kit';

interface ModalProps {
  onClose: () => void;
  isVisible: boolean;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ children, onClose, isVisible }) => {
  const [isClosing, setIsClosing] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isVisible && !isClosing && isAuthenticated()) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
      }, 300); // duration of the fade-out effect
    }
  }, [isVisible, isClosing]);

  if (!isVisible && !isClosing) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'} z-50 overflow-hidden`}>
      <div className="relative p-6 w-full h-full bg-[#081730] overflow-auto">
        <button
          onClick={() => {
            setIsClosing(true);
            setTimeout(onClose, 300); // delay the onClose to allow fade-out
          }}
          className="absolute top-0 right-0 mt-4 mr-4 text-white text-2xl z-50"
        >
          <ImCross size={20} />
        </button>
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;