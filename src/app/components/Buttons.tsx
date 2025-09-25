import React from 'react';
import { ButtonProps } from '../types/ButtonTypes';  // Import the types


const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick = () => {}, 
  variant = 'primary', 
  className = '', 
  disabled = false 
}) => {
  // Define the classNames for the button variants
  const variantClasses = {
    primary: 'bg-[#EC1373] text-white hover:bg-blue-600',
    secondary: 'bg-[#300D77] text-white hover:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 ease-in-out 
        ${variantClasses[variant]} 
        ${className} 
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
