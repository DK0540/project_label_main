import React from "react";
import { Link } from "react-scroll";
import "./Header.css";
import aavi from "./components/images/aavi.png";

function Header() {
  return (
    <header>
      <img src={aavi} alt="Logo" />
      <nav>
        <ul>
          <li>
            <Link to="home-page" smooth={true} duration={500}>
              Home
            </Link>
          </li>
          <li>
            <Link to="our-service" smooth={true} duration={500}>
              Service
            </Link>
          </li>
          <li>
            <Link to="our-work" smooth={true} duration={500}>
              Our work
            </Link>
          </li>
          <li>
            <Link to="about-us" smooth={true} duration={500}>
              About us
            </Link>
          </li>
          <li>
            <Link to="contact" smooth={true} duration={500}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="contact" smooth={true} duration={500}>
              Pricing
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

//=================================================>>>second ok
// import React from "react";
// import "./Header.css";

// const Header = () => {
//   const handleScroll = (elementId) => {
//     const element = document.getElementById(elementId);
//     element.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <header>
//       <img src="https://codetheweb.blog/assets/img/icon2.png" alt="Logo" />
//       <nav>
//         <ul>
//           <li>
//             <a href="#">Home</a>
//           </li>
//           <li>
//             <a href="#service">About</a>
//           </li>
//           <li>
//             <a href="#">Pricing</a>
//           </li>
//           <li>
//             <a href="#">Terms of use</a>
//           </li>
//           <li>
//             <a href="#">Contact</a>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;
//==================================================================>>>>>>>Original
// import React from "react";
// import "./Header.css";

// const Header = () => {
//   const handleScroll = (elementId) => {
//     const element = document.getElementById(elementId);
//     element.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <header className="header">
//       <div className="left-logo">
//         <h2>AAVI Labs</h2>
//       </div>
//       <nav className="right-nav">
//         <ul>
//           <li>
//             <a href="/">Home</a>
//           </li>
//           <li>
//             <a href="/about">About</a>
//           </li>
//           <li>
//             <a href="/contact">Contact</a>
//           </li>
//           <li>
//             <a href="/services">Services</a>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;
