import React from 'react';
import CustomSelect from '../ui/Selection';

const FieldRenderer = ({ field, value, yearlyData, years, onChange, onYearlyChange, className = "" }) => {
  const [name, label, type, hasYears] = field;

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {hasYears ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {years.map(year => (
              <div key={year} className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">{year}</span>
                <input
                  type="number"
                  value={yearlyData?.[name]?.[year] || ''}
                  onChange={(e) => onYearlyChange(name, year, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <input
          type={type === 'int' || type === 'float' ? 'number' : type === 'date' ? 'date' : type === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      )}
    </div>
  );
};

export default FieldRenderer;