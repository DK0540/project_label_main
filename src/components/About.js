import React from "react";
import "./about.css"; // Import the CSS file for styling
import { Link } from "react-scroll";
import abta from "./images/abta.jpg";
import abtb from "./images/abtb.jpg";
import abtc from "./images/abtc.jpg";

function About() {
  return (
    <>
      <Link to="about-us" smooth={true} duration={500}>
        <div className="about-container">
          <div className="leftDiv">
            <p className="about-form-head">About Us</p>
            <p className="about-form-content">
              Our advanced barcode generator is designed to cater to a wide
              range of industries and applications. Whether you're a retailer
              looking to manage your inventory efficiently, a manufacturer
              seeking traceability solutions, or a marketer aiming to engage
              your audience with dynamic QR codes, BarcodeGenerator has the
              perfect solution for you, we've got you covered!
            </p>

            <div className="small-about-container">
              <div className="small-leftDiv">
                <img src={abtc}></img>

                <h4>Fast and Efficient</h4>
                <p className="small-about-form-content">
                  Say goodbye to waiting around! BarcodeGenerator generates your
                  barcodes instantly.
                </p>
                <a className="small-a" href="#">
                  Learn More
                </a>
              </div>

              <div className="small-rightDiv">
                <img src={abtb}></img>

                <h4>Secure and Reliable</h4>
                <p className="small-about-form-content">
                  Our data and privacy are of utmost importance to us. You can
                  trust BarcodeGenerator with your sensitive information.
                </p>
                <a className="small-a" href="#">
                  Learn More
                </a>
              </div>
            </div>
          </div>

          {/* Right Div containing an image */}
          <div className="rightDiv">
            <img src={abta} alt="not found" />
          </div>
        </div>
      </Link>
    </>
  );
}

export default About;
