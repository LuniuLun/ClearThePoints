import { useState } from "react";
import "./Textfield.css";

export interface ITextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  errorMessage?: string;
}

const TextField = ({ value, name, label, errorMessage, onChange, ...props }: ITextFieldProps) => {
  const [valueInput, setValueInput] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
    onChange?.(e);
  };
  return (
    <div className="text-field">
      {label && (
        <label className="text-field__label" htmlFor={name}>
          {label}
        </label>
      )}
      <input name={name} value={valueInput} onChange={handleChange} {...props} />
      {errorMessage && <span className="text-field__error">{errorMessage}</span>}
    </div>
  );
};

export default TextField;
