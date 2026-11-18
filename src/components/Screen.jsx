import "./Screen.css";

const Screen = ({ value, expression }) => {
    return (
        <div className="screen">
            <div className="screen-expression">{expression}</div>
            <div className={`screen-value${value === 'Cannot divide by zero' ? ' error' : ''}`} aria-live="polite">{value}</div>
        </div>
    )
}

export default Screen;