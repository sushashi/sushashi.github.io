import "./Wrapper.css";

const Wrapper = ({ children, className = '' }) => {
    return <div className={`wrapper ${className}`.trim()}>{children}</div>
}

export default Wrapper;