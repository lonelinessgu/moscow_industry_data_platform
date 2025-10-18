// ui/Selection
import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({
  label,
  value,
  options,
  placeholder,
  error,
  onChange,
  className,
  name,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);
  const selectRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className={`mb-6 ${className || ''}`}>
      {label && (
        <label className="block text-blue-700 mb-2">{label}</label>
      )}
      <div
        className={`w-full p-3 border-2 rounded-lg ${
          error ? 'border-red-500' : 'border-blue-100'
        } relative ${
          disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:bg-blue-50'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {/* Текст + стрелка */}
        <div className="flex items-center justify-between">
          <div className="truncate">
            {selectedOption ? selectedOption.label : placeholder || 'Выберите значение'}
          </div>
          <div
            className={`ml-2 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            ▼
          </div>
        </div>

        {/* Выпадающий список */}
        {isOpen && (
          <ul className="absolute z-10 w-full max-h-60 overflow-auto bg-white border border-blue-300 rounded-lg mt-2 shadow-lg top-full left-0 border-t-0 rounded-t-none min-w-max">
            {options.map(opt => (
              <li
                key={opt.value}
                className={`p-2 hover:bg-blue-100 ${
                  opt.value === value ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-sm mt-1 text-red-500">{error}</p>}
    </div>
  );
};

export default CustomSelect;