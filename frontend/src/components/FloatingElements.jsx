import React from "react";
import "../styles/FloatingElements.css"; // Import CSS

const FloatingElements = () => {
  return (
    <div className="floating-elements">
      <div className="floating-element" style={{ left: "10%", "--delay": "0s", "--duration": "15s" }}>🍕</div>
      <div className="floating-element" style={{ left: "30%", "--delay": "2s", "--duration": "16s" }}>🍔</div>
      <div className="floating-element" style={{ left: "50%", "--delay": "4s", "--duration": "17s" }}>🍟</div>
      <div className="floating-element" style={{ left: "70%", "--delay": "6s", "--duration": "18s" }}>🍦</div>
      <div className="floating-element" style={{ left: "85%", "--delay": "8s", "--duration": "15s" }}>☕</div>
    </div>



  );
};

export default FloatingElements;
