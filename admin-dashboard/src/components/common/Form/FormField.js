import React from 'react';

const FormField = ({
    label,
    error,
    children,
    required = false,
    helpText,
    className = ""
}) => (
    <div className={`space-y-1 ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        {children}
        {helpText && (
            <p className="text-sm text-gray-500">{helpText}</p>
        )}
        {error && (
            <p className="text-sm text-red-600">{error}</p>
        )}
    </div>
);

export default FormField; 