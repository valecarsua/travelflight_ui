import React from "react";
import PropTypes from "prop-types";

const ActionButton = ({
  text = "Action",
  onClick = () => {},
  color = "#007BFF",
  textColor = "#FFFFFF",
  size = "medium",
  customStyles = {},
  icon = null,
  className = "",
  disabled = false,
  handleClick = () => {}, // valor por defecto
}) => {
  const sizes = {
    small: "8px 12px",
    medium: "10px 16px",
    large: "12px 20px",
    small_icon: "6px"
  };

  return (
    <button
      onClick={!disabled ? () => handleClick(onClick) : ''}
      style={{
        backgroundColor: disabled ? "#CCCCCC" : color,
        color: textColor,
        padding: sizes[size],
        border: "none",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...customStyles,
      }}
      className={`action-button ${className}`}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

ActionButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.oneOf(["small_icon", "small", "medium", "large"]),
  customStyles: PropTypes.object,
  icon: PropTypes.element,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func
  // handleClick: PropTypes.func.isRequired,
};

export default ActionButton;
