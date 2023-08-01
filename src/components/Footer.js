import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <>
      <div className="footerhead">
        <h2>Get started</h2>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>AAVI Labs</h3>
            <p>Address: 123 Main Street, City, Country</p>
            <p>Email: info@company.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
          <div className="footer-right">
            <h3 style={{ marginRight: "31px" }}>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="icon">
                <FaFacebook />
              </a>
              <a href="#" className="icon">
                <FaTwitter />
              </a>
              <a href="#" className="icon">
                <FaLinkedin />
              </a>
              <a href="#" className="icon">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">{/* ... */}</div>
      </footer>
    </>
  );
};

export default Footer;
