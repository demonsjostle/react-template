import React from "react";
import "./App.css";

const Welcome: React.FC = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome</h1>
        <p className="welcome-description">Discover the art of simplicity</p>
      </div>
      <div className="background-gradient"></div>
    </div>
  );
};

export default Welcome;
