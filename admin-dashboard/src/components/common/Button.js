import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const buttonStyles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-200 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  icon: 'p-2 rounded-full',
};

const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  const baseStyle = 'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors';
  const style = `${baseStyle} ${buttonStyles[variant]} ${className}`;

  return (
    <motion.button
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={style}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
      ) : (
        <>
          {icon && <span className="w-4 h-4">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button; 