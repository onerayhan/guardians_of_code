import React, { FC } from 'react';
import Slideshow from './Slideshow';

interface ModalProps {
  onClose: () => void;
  isVisible: boolean;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ children, onClose, isVisible }) => {
  const images = [
    '/src/assets/loginpage_singers/baris.svg',
    '/src/assets/loginpage_singers/ray.svg',
    '/src/assets/loginpage_singers/amy.svg',
    '/src/assets/loginpage_singers/cornell.svg',
    '/src/assets/loginpage_singers/slash.svg',
    '/src/assets/loginpage_singers/staley.svg',
];

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="p-6 rounded-2xl max-w-5xl w-full flex bg-primary-color overflow-hidden">
        <div className="flex-1">
          <Slideshow images={images} />
        </div>
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;