import "./Button.css";

const Button = ({ className = '', value, onClick, ariaLabel }) => {
  return (
    <button className={`calculator-key ${className}`} onClick={onClick} aria-label={ariaLabel || value} type="button">
      {value}
    </button>
  );
};

export default Button;
