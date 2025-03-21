import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  header, 
  children, 
  actions,
  gradient,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-lg shadow overflow-hidden ${className}`}
    >
      {header && (
        <div className={gradient ? `p-4 text-white ${gradient}` : 'p-4 bg-gray-50'}>
          {header}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>

      {actions && (
        <div className="flex justify-end gap-2 p-4 border-t">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default Card; 