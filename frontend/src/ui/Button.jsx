import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({
  label,
  onClick,
  navigate_to,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (navigate_to) {
      navigate(navigate_to);
    }
  };

  const baseClasses = `
    bg-gradient-to-r from-blue-400 to-blue-500
    text-white font-bold py-2 px-6 rounded-lg
    shadow-md hover:from-blue-500 hover:to-blue-600
    focus:outline-none focus:ring-2 focus:ring-blue-300
    active:scale-95
    transition-all duration-200
    cursor-pointer
    text-center
  `;

  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {label}
    </div>
  );
};

export default Button;