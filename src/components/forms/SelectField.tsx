import { SelectHTMLAttributes } from 'react';

type OptionType = {
  value: string | number;
  label: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: OptionType[];
  error?: string;
  isRequired?: boolean;
  className?: string;
};

export const SelectField = ({
  label,
  name,
  options,
  error,
  isRequired = false,
  className = '',
  ...props
}: SelectFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
