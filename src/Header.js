import React from "react";
import "./Header.css";

const Header = () => {
  const handleScroll = (elementId) => {
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="header-container">
      <div className="logo">
        <img src="/path/to/your/logo.png" alt="Logo" />
      </div>
      <nav className="nav-links">
        <ul>
          <li onClick={() => handleScroll("home")}>Home</li>
          <li onClick={() => handleScroll("work")}>Work</li>
          <li onClick={() => handleScroll("service")}>Service</li>
          <li onClick={() => handleScroll("contact")}>Contact</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
