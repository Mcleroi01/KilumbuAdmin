import { useState, ChangeEvent, KeyboardEvent } from 'react';

type ArrayInputFieldProps = {
  label: string;
  name: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  className?: string;
};

export const ArrayInputField = ({
  label,
  name,
  values = [],
  onChange,
  placeholder = 'Ajouter un élément',
  addButtonText = 'Ajouter',
  className = '',
}: ArrayInputFieldProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {addButtonText}
        </button>
      </div>

      {values.length > 0 && (
        <ul className="mt-2 space-y-1">
          {values.map((value, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span>{value}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:text-red-700"
                title="Supprimer"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
