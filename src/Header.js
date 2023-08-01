import React from "react";
import "./Header.css";

const Header = () => {
  const handleScroll = (elementId) => {
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="header">
      <div className="left-logo">
        <h2>AAVI Labs</h2>
      </div>
      <nav className="right-nav">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/services">Services</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
