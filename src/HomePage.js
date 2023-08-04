import React from "react";
import { Link } from "react-router-dom";
import "./HomePage2.css";
import Footer from "./components/Footer";
// import ImageGallery from "./components/ImageGallery";
import ServicesPage from "./components/ServicesPage";
import Header from "./Header";
import MyComponent from "./components/MyComponent";
import About from "./components/About";

import { Element } from "react-scroll";
import ImgCards from "./components/ImgCards";

const HomePage = () => {
  return (
    <div className="homea">
      <Header />
      <Element name="home-page" className="element">
        <div className="container">
          <Link to="/app">
            <button className="button">Create Your Label</button>
          </Link>
        </div>
      </Element>

      <Element name="our-service" className="element">
        <ServicesPage />
      </Element>
      <Element name="our-work" className="element">
        <ImgCards />
      </Element>
      <Element name="about-us" className="element">
        <About />
      </Element>
      <Element name="contact" className="element">
        <MyComponent />
      </Element>

      <Footer />
    </div>
  );
};

export default HomePage;
//=================================================================>>>>Lats update
// import React from "react";
// import { Link } from "react-router-dom";
// import "./HomePage2.css";
// import Footer from "./components/Footer";
// import ImageGallery from "./components/ImageGallery";
// import ServicesPage from "./components/ServicesPage";
// import Header from "./Header";
// import MyComponent from "./components/MyComponent";
// import About from "./components/About";

// import { Element } from "react-scroll";

// const HomePage = () => {
//   return (
//     <div className="homea">
//       <Header />
//       <Element name="home-page" className="element">
//         <div className="container">
//           <Link to="/app">
//             <button className="button">Create Your Label</button>
//           </Link>
//         </div>
//       </Element>

//       <Element name="our-service" className="element">
//         <ServicesPage />
//       </Element>
//       <Element name="our-work" className="element">
//         <ImageGallery />
//       </Element>
//       <Element name="about-us" className="element">
//         <About />
//       </Element>
//       <Element name="contact" className="element">
//         <MyComponent />
//       </Element>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;
//===================================================================>>>Last update

//===================================================================>>>>>Original
// import React from "react";
// import { Link } from "react-router-dom";
// import "./homepage.css";

// const HomePage = () => {
//   return (
//     <div>
//       <h1>Welcome to the Home Page</h1>
// <Link to="/app">
//   <button className="button-3">Create Label Button</button>
// </Link>
//     </div>
//   );
// };

// export default HomePage;
