import React from "react";
import "../styles/FloatingElements.css"; // Import CSS

const FloatingElements = () => {
  return (
    <div className="floating-elements">
      <div className="floating-element" style={{ left: "10%", animationDelay: "0s" }}>
        🍜
      </div>
      <div className="floating-element" style={{ left: "20%", animationDelay: "-3s" }}>
        🥟
      </div>
      <div className="floating-element" style={{ left: "40%", animationDelay: "-5s" }}>
        ☕
      </div>
      <div className="floating-element" style={{ left: "60%", animationDelay: "-7s" }}>
        🥗
      </div>
      <div className="floating-element" style={{ left: "80%", animationDelay: "-9s" }}>
        🍊
      </div>
    </div>
  );
};

export default FloatingElements;
