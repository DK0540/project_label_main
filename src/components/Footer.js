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
            <p>
              AAV INNOVATION LABS, DAYANANDA LAYOUT, 3rd CROSS RAMAMURTHY NAGAR,
              BANGALORE, KARNATAKA-560016
            </p>
            <p>Email: info@aavilabs.com</p>
            <p>Phone: +91-7899414941</p>
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
              <a
                href="https://www.linkedin.com/company/aav-innovation-labs/"
                className="icon"
              >
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
