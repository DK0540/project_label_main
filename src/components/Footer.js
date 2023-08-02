import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./footer.css";
import { Link } from "react-scroll";
import aavi from "./images/aavic.png";

const Footer = () => {
  return (
    <>
      <Link to="home-page" smooth={true} duration={500}>
        <div className="footerhead">
          <h2>Get started</h2>
        </div>
      </Link>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <img className="footimg" src={aavi} alt="Logo" />
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
