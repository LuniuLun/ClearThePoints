import { memo } from "react";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  title: string;
}

const Button = ({ title, disabled = false, ...props }: IButtonProps) => (
  <button {...props} disabled={disabled}>
    {title}
  </button>
);

export default memo(Button);
