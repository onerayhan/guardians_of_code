import { FC, ReactNode, useState, useEffect } from 'react';

interface BoxProps {
  children: ReactNode;
  onClose: () => void;
  isVisible: boolean;
  size?: 'large' | 'small';
}

const Box: FC<BoxProps> = ({ children, onClose, isVisible, size = 'large' }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  const sizeClasses = {
    large: 'max-w-lg p-6',
    small: 'max-w-xs p-3',
  };

  useEffect(() => {
    if (isVisible) setShouldRender(true);
  }, [isVisible]);

  const handleTransitionEnd = () => {
    if (!isVisible) setShouldRender(false);
  };

  return (
    shouldRender && (
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`fixed bottom-0 mb-4 mx-auto left-0 right-0 bg-white text-black ${sizeClasses[size]} rounded-lg flex items-center justify-between transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
        <button onClick={onClose} className="ml-4 text-lg">&times;</button>
      </div>
    )
  );
};

export default Box;