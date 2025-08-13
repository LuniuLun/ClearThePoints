import type { TStatusVariant } from "../../types/variant";
import "./Heading.css";

export interface IHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  as?: "h1" | "h2";
  variant?: TStatusVariant;
}

const Heading = ({ title, as: Tag = "h1", variant = "info", ...props }: IHeadingProps) => {
  return (
    <Tag className={`heading heading--${variant}`} {...props}>
      {title}
    </Tag>
  );
};

export default Heading;
