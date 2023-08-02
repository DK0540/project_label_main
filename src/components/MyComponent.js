import React from "react";
import "./contact.css";
import { Link } from "react-scroll";

const MyComponent = () => {
  return (
    <>
      <Link to="contact" smooth={true} duration={500}>
        <div className="cnthead">
          <h2>Contact Us</h2>
        </div>
        <div className="form-container">
          <div className="app-container">
            {/* First Form */}
            <form className="myForm1">
              <p className="contact-form-head">Contact Form</p>
              <div className="row">
                <div className="col">
                  <label htmlFor="firstName1">First Name</label>
                  <input type="text" id="firstName1" required />
                </div>
                <div
                  className="col"
                  style={{ marginLeft: "40px", marginRight: "20px" }}
                >
                  <label htmlFor="lastName1">Last Name</label>
                  <input type="text" id="lastName1" required />
                </div>
              </div>
              <div>
                <label>Email</label>
                <input
                  className="full-input"
                  type="email"
                  id="email"
                  required
                />
              </div>
              <div>
                <label>Subject</label>
                <input
                  className="full-input"
                  type="text"
                  id="subject"
                  required
                />
              </div>
              <div>
                <label>Message</label>
                <textarea
                  rows={6}
                  placeholder="Write your notes or questions here...."
                  required
                />
              </div>

              <button type="submit">SEND MESSAGE</button>
            </form>

            {/* Second Form */}
            <form className="myForm2">
              <div>
                <h4>Address</h4>
                <p>203 Fake St. Mountain View, San Francisco, California,USA</p>
              </div>
              <div>
                <h4>Phone</h4>
                <p id="contact-phone">+1 232 3235 524</p>
              </div>
              <div>
                <h4>Email Address</h4>
                <p id="contact-email">youremail@domain.com</p>
              </div>
            </form>
          </div>
        </div>
      </Link>
    </>
  );
};

export default MyComponent;
